const Order = require("../models/order");
const FoodItem = require("../models/foodItem");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");

//setting up config file
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ErrorHandler("Stripe secret key is not configured on the server", 500);
  }
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
};

const getCheckoutAddress = (session) =>
  session?.shipping_details?.address ||
  session?.customer_details?.address ||
  session?.collected_information?.shipping_details?.address ||
  null;

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;

  if (!session_id) {
    return next(new ErrorHandler("Stripe session id is required", 400));
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["customer", "line_items"],
  });

  // 1. Idempotency Check: if order was already recorded for this checkout session or payment intent
  const existingOrder = await Order.findOne({
    $or: [
      { "paymentInfo.id": session.payment_intent },
      { "paymentInfo.sessionId": session_id },
    ],
  }).populate("restaurant");

  if (existingOrder) {
    return res.status(200).json({
      success: true,
      order: existingOrder,
    });
  }

  // 2. Resilient User Identification
  const User = require("../models/user");
  let userId = req.user?._id || req.user?.id;
  if (!userId && session.metadata?.userId) {
    userId = session.metadata.userId;
  }
  if (!userId && session.customer_email) {
    const userDoc = await User.findOne({ email: session.customer_email.toLowerCase() });
    if (userDoc) userId = userDoc._id;
  }

  // 3. Retrieve Cart or construct from Stripe Line Items
  const cart = userId
    ? await Cart.findOne({ user: userId })
        .populate({
          path: "items.foodItem",
          select: "name price images restaurant",
        })
        .populate({
          path: "restaurant",
          select: "name",
        })
    : null;

  const stripeAddress = getCheckoutAddress(session) || {};
  const phoneNo =
    session?.customer_details?.phone ||
    req.user?.phoneNumber ||
    "9999999999";

  let deliveryInfo = {
    address:
      [stripeAddress.line1, stripeAddress.line2].filter(Boolean).join(" ") ||
      "Order delivery address",
    city: stripeAddress.city || "Bangalore",
    phoneNo,
    postalCode: stripeAddress.postal_code || "560001",
    country: stripeAddress.country || "IN",
  };

  let orderItems = [];
  let restaurantId = null;

  if (cart && cart.items && cart.items.length) {
    orderItems = cart.items.map((item) => ({
      name: item.foodItem?.name || "Food Item",
      quantity: item.quantity,
      image: item.foodItem?.images?.[0]?.url || "/images/template.jpeg",
      price: item.foodItem?.price || 0,
      fooditem: item.foodItem?._id,
    }));
    restaurantId = cart.restaurant?._id || cart.restaurant;
  } else if (session.line_items?.data?.length) {
    // Reconstruct items from verified Stripe checkout session
    orderItems = session.line_items.data.map((li) => ({
      name: li.description || "Food Item",
      quantity: li.quantity,
      image: "/images/template.jpeg",
      price: (li.price?.unit_amount || 0) / 100,
    }));
    restaurantId = session.metadata?.restaurantId || null;
  }

  if (!orderItems.length) {
    return next(new ErrorHandler("No order items found. Cannot finalize order.", 400));
  }

  let paymentInfo = {
    id: session.payment_intent,
    sessionId: session_id,
    status: session.payment_status,
  };

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge: +(session.shipping_cost?.amount_subtotal || 0) / 100,
    itemsPrice: +session.amount_subtotal / 100,
    finalTotal: +session.amount_total / 100,
    user: userId || req.user?.id,
    restaurant: restaurantId,
    paidAt: Date.now(),
  });

  if (userId) {
    await Cart.findOneAndDelete({ user: userId });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get single order   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Get the user ID from req.user
  const userId = new ObjectId(req.user.id);
  // Find orders for the specific user using the retrieved user ID
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
