const express = require("express");
const router = express.Router();

const {
  generateFoodAI,
  generateAndsaveFoodAI,
  analyzeRestaurantReviews,
} = require("../controllers/ai.controller");
const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

router.post(
  "/food-description",
  protect,
  authorizeRoles("admin"),
  generateFoodAI,
);

router.post(
  "/food-description/:foodId/save",
  protect,
  authorizeRoles("admin"),
  generateAndsaveFoodAI,
);
router.put(
  "/admin/restaurants/:id/analyze",
  protect,
  authorizeRoles("admin"),
  analyzeRestaurantReviews,
);
module.exports = router;
