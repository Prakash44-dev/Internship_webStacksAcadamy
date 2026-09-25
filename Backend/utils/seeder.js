const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", "config", "config.env") });

const connectDatabase = require("../db");
const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/foodItem");
const Menu = require("../models/menu");

const sampleRestaurants = [
  {
    name: "Zyka North Indian Feast",
    isVeg: false,
    address: "Plot 42, Brigade Road, Bangalore",
    ratings: 4.6,
    numOfReviews: 24,
    location: {
      type: "Point",
      coordinates: [77.6066, 12.9724],
    },
    images: [
      {
        public_id: "default",
        url: "/images/template.jpeg",
      },
    ],
    reviews: [
      {
        name: "Rahul Sharma",
        rating: 5,
        Comment: "The butter chicken and garlic naan are outstanding!",
      },
      {
        name: "Pooja Patel",
        rating: 4,
        Comment: "Great flavor and quick delivery.",
      },
    ],
  },
  {
    name: "Green Leaf Pure Veg",
    isVeg: true,
    address: "15, 100 Feet Road, Indiranagar, Bangalore",
    ratings: 4.8,
    numOfReviews: 38,
    location: {
      type: "Point",
      coordinates: [77.6413, 12.9784],
    },
    images: [
      {
        public_id: "default",
        url: "/images/flat-lay-green-vegetables-fruits.jpg",
      },
    ],
    reviews: [
      {
        name: "Aman Verma",
        rating: 5,
        Comment: "Fresh, hygienic, and authentic vegetarian dishes.",
      },
    ],
  },
  {
    name: "Spice Symphony Bistro",
    isVeg: false,
    address: "88, Koramangala 5th Block, Bangalore",
    ratings: 4.4,
    numOfReviews: 18,
    location: {
      type: "Point",
      coordinates: [77.6186, 12.9352],
    },
    images: [
      {
        public_id: "default",
        url: "/images/template.jpeg",
      },
    ],
    reviews: [
      {
        name: "Sneha Reddy",
        rating: 4,
        Comment: "Loved the biryani and starter platters.",
      },
    ],
  },
];

const seedData = async () => {
  try {
    await connectDatabase();

    const existingCount = await Restaurant.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} restaurants. Cleaning up before re-seeding...`);
      await Promise.all([
        Restaurant.deleteMany(),
        FoodItem.deleteMany(),
        Menu.deleteMany(),
      ]);
      console.log("Existing data cleared.");
    }

    for (const restData of sampleRestaurants) {
      const restaurant = await Restaurant.create(restData);
      console.log(`Created restaurant: ${restaurant.name}`);

      // Create food items for this restaurant
      const items = [];
      if (restaurant.isVeg) {
        items.push(
          await FoodItem.create({
            name: "Paneer Butter Masala",
            price: 280,
            description: "Fresh cottage cheese cooked in creamy tomato butter sauce.",
            spiceLevel: "medium",
            stock: 30,
            restaurant: restaurant._id,
            images: [{ public_id: "default", url: "/images/template.jpeg" }],
            ratings: 4.8,
            numOfReviews: 15,
          }),
          await FoodItem.create({
            name: "Crispy Veg Spring Rolls",
            price: 180,
            description: "Golden fried rolls packed with fresh julienned vegetables.",
            spiceLevel: "mild",
            stock: 25,
            restaurant: restaurant._id,
            images: [{ public_id: "default", url: "/images/template.jpeg" }],
            ratings: 4.5,
            numOfReviews: 10,
          }),
          await FoodItem.create({
            name: "Dal Makhani with Jeera Rice",
            price: 240,
            description: "Slow-cooked black lentils in butter paired with aromatic cumin rice.",
            spiceLevel: "mild",
            stock: 40,
            restaurant: restaurant._id,
            images: [{ public_id: "default", url: "/images/template.jpeg" }],
            ratings: 4.9,
            numOfReviews: 20,
          })
        );
      } else {
        items.push(
          await FoodItem.create({
            name: "Murgh Butter Chicken",
            price: 320,
            description: "Tender chicken tikka cooked in velvety makhani gravy.",
            spiceLevel: "medium",
            stock: 35,
            restaurant: restaurant._id,
            images: [{ public_id: "default", url: "/images/template.jpeg" }],
            ratings: 4.9,
            numOfReviews: 28,
          }),
          await FoodItem.create({
            name: "Hyderabadi Chicken Dum Biryani",
            price: 290,
            description: "Fragrant basmati rice layered with spiced chicken and fried onions.",
            spiceLevel: "hot",
            stock: 50,
            restaurant: restaurant._id,
            images: [{ public_id: "default", url: "/images/template.jpeg" }],
            ratings: 4.7,
            numOfReviews: 32,
          }),
          await FoodItem.create({
            name: "Garlic Butter Naan",
            price: 60,
            description: "Traditional tandoor-baked flatbread brushed with garlic butter.",
            spiceLevel: "mild",
            stock: 100,
            restaurant: restaurant._id,
            images: [{ public_id: "default", url: "/images/template.jpeg" }],
            ratings: 4.6,
            numOfReviews: 14,
          })
        );
      }

      // Create Menu for restaurant
      await Menu.create({
        restaurant: restaurant._id,
        menu: [
          {
            category: "Popular Specialties",
            items: items.map((item) => item._id),
          },
        ],
      });
      console.log(`Created menu with ${items.length} items for ${restaurant.name}`);
    }

    console.log("All sample data seeded successfully into MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("Seeder error:", err);
    process.exit(1);
  }
};

seedData();
