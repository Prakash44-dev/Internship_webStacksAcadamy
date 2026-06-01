const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const FoodItem = require("../models/foodItem");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

const normalizeRestaurantPayload = (body) => {
  const payload = { ...body };

  if (payload.imageUrl) {
    payload.images = [
      {
        public_id: "default",
        url: payload.imageUrl,
      },
    ];
    delete payload.imageUrl;
  }

  if (!payload.images || payload.images.length === 0) {
    payload.images = [
      {
        public_id: "default",
        url: "/images/template.jpeg",
      },
    ];
  }

  if (!payload.location) {
    let latitude;
    let longitude;

    if (typeof payload.coordinates === "string") {
      const [latValue, lngValue] = payload.coordinates
        .split(",")
        .map((value) => Number(value.trim()));
      latitude = latValue;
      longitude = lngValue;
    } else if (Array.isArray(payload.coordinates)) {
      latitude = Number(payload.coordinates[0]);
      longitude = Number(payload.coordinates[1]);
    } else {
      latitude = Number(payload.latitude);
      longitude = Number(payload.longitude);
    }

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      payload.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }
  }

  delete payload.coordinates;
  delete payload.latitude;
  delete payload.longitude;

  return payload;
};

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Restaurant.find(), req.query)
    .search()
    .sort();
  const restaurants = await apiFeatures.query;

  res.status(200).json({
    status: "success",
    count: restaurants.length,
    restaurants: restaurants,
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.create(normalizeRestaurantPayload(req.body));
  res.status(201).json({
    status: "success",
    restaurant,
  });
});

//Get restaurant by id
exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No Restaurant found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No document found with that ID", 404));

  await Promise.all([
    Menu.deleteMany({ restaurant: req.params.storeId }),
    FoodItem.deleteMany({ restaurant: req.params.storeId }),
  ]);

  res.status(204).json({
    status: "success",
  });
});
