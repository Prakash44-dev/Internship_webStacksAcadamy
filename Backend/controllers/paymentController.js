const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", "config", "config.env") });

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ErrorHandler("Stripe secret key is not configured on the server", 500);
  }
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
};

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    phone_number_collection: {
      enabled: true,
    },
    line_items: (req.body.items || []).map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.foodItem?.name || "Food Item",
          ...(item.foodItem?.images?.[0]?.url &&
          item.foodItem.images[0].url.startsWith("http")
            ? { images: [item.foodItem.images[0].url] }
            : {}),
        },
        unit_amount: Math.round(Number(item.foodItem?.price || 0) * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery Charges",
          type: "fixed_amount",
          fixed_amount: {
            amount: 5500, // Amount in paise (e.g., 5500 = 55 INR)
            currency: "inr",
          },
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 3,
            },
          },
        },
      },
    ],
    success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/cart`,
  });
  res.status(200).json({ url: session.url });
});

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY || "",
  });
});
