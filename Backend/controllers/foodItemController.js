const Fooditem = require("../models/foodItem");
const Menu = require("../models/menu");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllFoodItems = catchAsync(async (req, res, next) => {
  let restaurantId = {};
  if (req.params.storeId) {
    restaurantId = { restaurant: req.params.storeId };
  }

  const foodItems = await Fooditem.find(restaurantId).populate("restaurant");
  res.status(200).json({
    status: "success",
    results: foodItems.length,
    data: foodItems,
  });
});

// /v1/eats/stores/{store_id}/menus
exports.createFoodItem = catchAsync(async (req, res, next) => {
  // handle optional imageUrl input by converting to images array
  const body = { ...req.body };
  if (body.imageUrl) {
    body.images = [
      {
        public_id: "default",
        url: body.imageUrl,
      },
    ];
    delete body.imageUrl;
  }

  if (!body.images || body.images.length === 0) {
    body.images = [
      {
        public_id: "default",
        url: "/images/template.jpeg",
      },
    ];
  }

  if (!body.spiceLevel) {
    body.spiceLevel = "medium";
  }

  const fooditem = await Fooditem.create(body);
  res.status(201).json({
    status: "success",
    data: fooditem,
  });
});

exports.getFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findById(req.params.foodId);

  if (!foodItem)
    return next(new ErrorHandler("No foodItem found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: foodItem,
  });
});

exports.updateFoodItem = catchAsync(async (req, res, next) => {
  const updates = { ...req.body };

  if (updates.imageUrl) {
    updates.images = [
      {
        public_id: "default",
        url: updates.imageUrl,
      },
    ];
    delete updates.imageUrl;
  }

  if (updates.spiceLevel === "") {
    delete updates.spiceLevel;
  }

  const foodItem = await Fooditem.findByIdAndUpdate(
    req.params.foodId,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!foodItem)
    return next(new ErrorHandler("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: foodItem,
  });
});

exports.deleteFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findByIdAndDelete(req.params.foodId);

  if (!foodItem)
    return next(new ErrorHandler("No document found with that ID", 404));

  const menus = await Menu.find({ "menu.items": req.params.foodId });

  await Promise.all(
    menus.map(async (menu) => {
      menu.menu = menu.menu.map((category) => ({
        ...category.toObject(),
        items: category.items.filter(
          (item) => item.toString() !== req.params.foodId,
        ),
      }));

      menu.menu = menu.menu.filter((category) => category.items.length > 0);

      if (menu.menu.length === 0) {
        await menu.deleteOne();
        return;
      }

      await menu.save();
    }),
  );

  res.status(204).json({
    status: "success",
  });
});
