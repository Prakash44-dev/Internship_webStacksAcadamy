const Menu = require("../models/menu");
const FoodItem = require("../models/foodItem");

const ErrorHandler = require("../utils/errorHandler");

const catchAsync = require("../middlewares/catchAsyncErrors");

// GET ALL MENUS
exports.getAllMenus = catchAsync(async (req, res, next) => {

  const filter = req.params.storeId
    ? { restaurant: req.params.storeId }
    : {};

  const menu = await Menu.find(filter).populate("menu.items");

  res.status(200).json({
    status: "success",
    count: menu.length,
    data: menu,
  });

});

// CREATE MENU
exports.createMenu = catchAsync(async (req, res, next) => {
  const restaurantId = req.params.storeId || req.body.restaurant;
  const category =
    req.body.category || req.body.menu?.[0]?.category || req.body.name;

  if (!restaurantId) {
    return next(new ErrorHandler("Restaurant is required", 400));
  }

  if (!category) {
    return next(new ErrorHandler("Menu category is required", 400));
  }

  let menu = await Menu.findOne({ restaurant: restaurantId });

  if (!menu) {
    menu = await Menu.create({
      restaurant: restaurantId,
      menu: [{ category, items: [] }],
    });
  } else {
    const exists = menu.menu.some(
      (entry) => entry.category.toLowerCase() === category.toLowerCase(),
    );

    if (!exists) {
      menu.menu.push({ category, items: [] });
      await menu.save();
    }
  }

  await menu.populate("menu.items");

  res.status(201).json({
    status: "success",
    data: menu,
  });

});

// DELETE MENU
exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findById(req.params.menuId);

  if (!menu) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }

  const { category } = req.body;

  if (!category) {
    await menu.deleteOne();

    return res.status(204).json({
      status: "success",
    });
  }

  menu.menu = menu.menu.filter((entry) => entry.category !== category);

  if (menu.menu.length === 0) {
    await menu.deleteOne();
  } else {
    await menu.save();
  }

  res.status(204).json({
    status: "success",
  });

});

// ADD ITEM TO MENU
exports.addItemToMenu = catchAsync(async (req, res, next) => {

  const { category, foodItemId } = req.body;
  const menuId = req.params.menuId;

  if (!menuId) {
    return next(new ErrorHandler("Menu ID is required", 400));
  }

  const menu = await Menu.findById(menuId);

  if (!menu) {
    return next(new ErrorHandler("Menu not found", 404));
  }

  // find category
  let cat = menu.menu.find((c) => c.category === category);

  // if not found, create new
  if (!cat) {
    cat = { category, items: [] };
    menu.menu.push(cat);
  }

  const isAlreadyAdded = cat.items.some(
    (item) => item.toString() === foodItemId,
  );

  if (!isAlreadyAdded) {
    cat.items.push(foodItemId);
  }

  await menu.save();
  await FoodItem.findByIdAndUpdate(foodItemId, {
    menu: menu._id,
    restaurant: menu.restaurant,
  });

  await menu.populate("menu.items");

  res.status(200).json({
    status: "success",
    data: menu,
  });

});
