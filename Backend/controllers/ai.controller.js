const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const aiService = require("../services/ai.service");
const FoodItem = require("../models/foodItem");
const Menu = require("../models/menu");

const Restaurant = require("../models/restaurant");
const { analyzeReviewsWithAI } = require("../services/aiReviewAnalyzer");

exports.generateFoodAI = catchAsyncErrors(async (req, res) => {
  const { name, category, spiceLevel, price } = req.body;

  if (!name || !category || price === undefined || price === null || price === "") {
    return res.status(400).json({
      success: false,
      message: "Name, category and price are required",
    });
  }

  const aiData = await aiService.generateDishDescription({
    name,
    category,
    spiceLevel,
    price,
  });

  res.status(200).json({ success: true, aiData });
});

exports.generateAndsaveFoodAI = catchAsyncErrors(async (req, res) => {
  const { foodId } = req.params;
  const foodItem = await FoodItem.findById(foodId);

  if (!foodItem) {
    return res.status(404).json({ success: false, message: "Food item not found" });
  }

  let category = "Main Course";

  if (foodItem.menu) {
    const menu = await Menu.findById(foodItem.menu);
    const matchedCategory = menu?.menu?.find((entry) =>
      entry.items.some((item) => item.toString() === foodItem._id.toString()),
    );
    category = matchedCategory?.category || category;
  }

  const aiData = await aiService.generateDishDescription({
    name: foodItem.name,
    category,
    spiceLevel: foodItem.spiceLevel,
    price: foodItem.price,
  });

  foodItem.aiDescription = aiData.description;
  foodItem.aiTags = aiData.tags;
  foodItem.aiAllergens = aiData.allergens;
  foodItem.aiServes = aiData.serves;
  foodItem.aiBestFor = aiData.bestFor;
  foodItem.description = aiData.description;

  await foodItem.save();

  res.status(200).json({ success: true, aiData, foodItem });
});

exports.analyzeRestaurantReviews = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  if (!restaurant.reviews || restaurant.reviews.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No reviews to analyze",
    });
  }

  const aiData = await analyzeReviewsWithAI(restaurant.reviews);

  restaurant.reviewSentiment = aiData.sentiment;
  restaurant.reviewSummaryBullets = aiData.summaryBullets;
  restaurant.reviewTopMentions = aiData.topMentions;

  await restaurant.save();

  res.status(200).json({
    success: true,
    aiData,
    restaurant,
  });
});
