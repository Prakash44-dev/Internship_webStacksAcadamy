const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", "config", "config.env") });

const connectDatabase = require("../db");
const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/foodItem");
const Menu = require("../models/menu");

const sampleRestaurants = [
  // ===================== BANGALORE (6) =====================
  {
    name: "Meghana Foods",
    isVeg: false,
    city: "Bangalore",
    address: "52, 5th Cross, 60 Feet Road, Koramangala 5th Block, Bangalore",
    ratings: 4.8,
    numOfReviews: 342,
    location: { type: "Point", coordinates: [77.6193, 12.9344] },
    images: [{ public_id: "meghana", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Aditya Rao", rating: 5, Comment: "The Meghana Special Biryani has no comparison in Bangalore. Absolutely sublime spice and tender chicken!" },
      { name: "Pooja Hegde", rating: 5, Comment: "Fast delivery and the portions are huge. Boneless biryani is unbeatable." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Legendary biryani flavors", "Generous chicken portions", "Extremely consistent spice blend"],
    reviewTopMentions: ["Special Biryani", "Boneless Biryani", "Paneer 65"],
    items: [
      { name: "Meghana Special Chicken Biryani", price: 340, description: "Signature spicy Andhra style biryani served with juicy chicken and salan.", spiceLevel: "hot", stock: 50, images: [{ public_id: "m1", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 120 },
      { name: "Boneless Chicken Biryani", price: 360, description: "Tender boneless chicken tossed in aromatic fiery masala over dum basmati rice.", spiceLevel: "hot", stock: 45, images: [{ public_id: "m2", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 95 },
      { name: "Paneer 65 Biryani", price: 310, description: "Crisp spiced paneer cubes layered with fragrance-infused long grain basmati rice.", spiceLevel: "medium", stock: 30, images: [{ public_id: "m3", url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 60 },
    ],
  },
  {
    name: "Vidyarthi Bhavan",
    isVeg: true,
    city: "Bangalore",
    address: "32, Gandhi Bazaar Main Road, Basavanagudi, Bangalore",
    ratings: 4.9,
    numOfReviews: 480,
    location: { type: "Point", coordinates: [77.5701, 12.9439] },
    images: [{ public_id: "vidyarthi", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Suresh Kumar", rating: 5, Comment: "Iconic restaurant since 1943. Thick, golden butter masala dosa that melts in mouth!" },
      { name: "Ananya Deshmukh", rating: 5, Comment: "Authentic South Indian heritage breakfast paired with piping hot filter coffee." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Heritage culinary landmark", "Crispy exterior and fluffy center dosas", "Authentic Karnataka filter coffee"],
    reviewTopMentions: ["Benne Masala Dosa", "Filter Coffee", "Kesari Bath"],
    items: [
      { name: "Crispy Benne Masala Dosa", price: 110, description: "Legendary thick golden dosa roasted in pure butter with spiced potato filling.", spiceLevel: "mild", stock: 100, images: [{ public_id: "v1", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 240 },
      { name: "Kesari Bath", price: 75, description: "Melt-in-mouth semolina dessert rich with ghee, saffron, and roasted cashews.", spiceLevel: "mild", stock: 40, images: [{ public_id: "v2", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 85 },
      { name: "Traditional Filter Kaapi", price: 45, description: "Freshly brewed chicory coffee poured frothy with pure boiled cow milk.", spiceLevel: "mild", stock: 120, images: [{ public_id: "v3", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 140 },
    ],
  },
  {
    name: "Truffles",
    isVeg: false,
    city: "Bangalore",
    address: "22, St. Marks Road, Ashok Nagar, Bangalore",
    ratings: 4.7,
    numOfReviews: 310,
    location: { type: "Point", coordinates: [77.6015, 12.9729] },
    images: [{ public_id: "truffles", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Rohan Nair", rating: 5, Comment: "Best burgers in town by a mile. Juicy patties, loaded cheese, and great shakes." },
      { name: "Kritika S", rating: 4, Comment: "Value for money continental food that never disappoints." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Juicy gourmet burgers", "Thick creamy milkshakes", "Top choice for youth and casual dining"],
    reviewTopMentions: ["All-American Burger", "Peri Peri Burger", "Ferrero Shake"],
    items: [
      { name: "All-American Cheese Burger", price: 290, description: "Succulent grilled patty with melted cheddar, lettuce, gherkins, and house sauce.", spiceLevel: "mild", stock: 60, images: [{ public_id: "t1", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 110 },
      { name: "Peri Peri Crispy Chicken Burger", price: 310, description: "Crisp batter fried chicken glazed in fiery peri peri seasoning with slaw.", spiceLevel: "medium", stock: 55, images: [{ public_id: "t2", url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 95 },
      { name: "Ferrero Rocher Thick Shake", price: 210, description: "Decadent hazelnut chocolate shake blended with chocolate ice cream and nuts.", spiceLevel: "mild", stock: 40, images: [{ public_id: "t3", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 70 },
    ],
  },
  {
    name: "Toit Brewpub & Kitchen",
    isVeg: false,
    city: "Bangalore",
    address: "298, 100 Feet Road, Indiranagar, Bangalore",
    ratings: 4.8,
    numOfReviews: 290,
    location: { type: "Point", coordinates: [77.6409, 12.9792] },
    images: [{ public_id: "toit", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Vikram Malhotra", rating: 5, Comment: "The wood-fired pizzas are heavenly with thin crust and fresh mozzarella!" },
      { name: "Neha Menon", rating: 5, Comment: "Superb beer-battered fish and smoky wings. True Bangalore icon." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Authentic wood fired oven pizza", "Crispy beer-battered appetizers", "Premium pub-dining experience"],
    reviewTopMentions: ["Wood Fired Pizza", "Fish & Chips", "BBQ Wings"],
    items: [
      { name: "Toit Special Wood-Fired Pizza", price: 480, description: "Artisanal slow-fermented dough topped with san marzano sauce and fresh mozzarella.", spiceLevel: "medium", stock: 35, images: [{ public_id: "tp1", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 85 },
      { name: "Tint-in Beer Batter Fish & Chips", price: 420, description: "Golden crusted fresh fish fillets with tartar sauce and thick cut french fries.", spiceLevel: "mild", stock: 30, images: [{ public_id: "tp2", url: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 60 },
      { name: "Smoky BBQ Glazed Wings", price: 360, description: "Crispy chicken wings tossed in rich hickory smoked barbecue sauce.", spiceLevel: "medium", stock: 40, images: [{ public_id: "tp3", url: "https://images.unsplash.com/photo-1527477378408-1bc09c213137?w=800&auto=format&fit=crop&q=80" }], ratings: 4.6, numOfReviews: 50 },
    ],
  },
  {
    name: "Nagarjuna Restaurant",
    isVeg: false,
    city: "Bangalore",
    address: "44/1, Residency Road, Shanthala Nagar, Bangalore",
    ratings: 4.7,
    numOfReviews: 320,
    location: { type: "Point", coordinates: [77.6074, 12.9698] },
    images: [{ public_id: "nagarjuna", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Praveen V", rating: 5, Comment: "Traditional banana leaf meal with fiery gunpowder and ghee. The Sholay kebab is legendary." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Banana leaf Andhra meals", "Spicy crisp starters", "Aromatic Biryani"],
    reviewTopMentions: ["Andhra Meals", "Chicken Sholay", "Mutton Biryani"],
    items: [
      { name: "Andhra Full Meals", price: 320, description: "Traditional platter with rice, pappu, sambar, rasam, curd, podi, and ghee.", spiceLevel: "hot", stock: 80, images: [{ public_id: "n1", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 120 },
      { name: "Signature Chicken Sholay Kebab", price: 340, description: "Crispy deep-fried chicken tossed with green chillies and curry leaves.", spiceLevel: "hot", stock: 60, images: [{ public_id: "n2", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 140 },
      { name: "Andhra Mutton Dum Biryani", price: 390, description: "Rich spiced tender mutton layered with fragrant short grain basmati rice.", spiceLevel: "hot", stock: 35, images: [{ public_id: "n3", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 75 },
    ],
  },
  {
    name: "Corner House Ice Creams",
    isVeg: true,
    city: "Bangalore",
    address: "4, Rest House Crescent Road, Lavelle Road, Bangalore",
    ratings: 4.9,
    numOfReviews: 410,
    location: { type: "Point", coordinates: [77.6009, 12.9719] },
    images: [{ public_id: "cornerhouse", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Divya N", rating: 5, Comment: "Death By Chocolate is pure ecstasy. Bangalore's greatest dessert institution!" },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Pure indulgence ice cream sundaes", "Rich dark chocolate fudge", "Great quick-service delivery"],
    reviewTopMentions: ["Death By Chocolate", "Hot Chocolate Fudge", "Almond Fudge"],
    items: [
      { name: "Death By Chocolate (DBC)", price: 260, description: "Dense chocolate cake topped with vanilla ice cream, hot chocolate fudge, and cherries.", spiceLevel: "mild", stock: 90, images: [{ public_id: "ch1", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 220 },
      { name: "Classic Hot Chocolate Fudge", price: 220, description: "Twin scoops of creamy vanilla covered in piping hot homemade cocoa fudge and peanuts.", spiceLevel: "mild", stock: 80, images: [{ public_id: "ch2", url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 130 },
      { name: "Roasted Almond Sundae", price: 230, description: "Toasted crunchy California almonds over chocolate and coffee ice creams.", spiceLevel: "mild", stock: 50, images: [{ public_id: "ch3", url: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 65 },
    ],
  },

  // ===================== MUMBAI (5) =====================
  {
    name: "Bademiya",
    isVeg: false,
    city: "Mumbai",
    address: "Tulloch Road, Apollo Bunder, Colaba, Mumbai",
    ratings: 4.7,
    numOfReviews: 380,
    location: { type: "Point", coordinates: [72.8335, 18.9220] },
    images: [{ public_id: "bademiya", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Farhan Siddiqui", rating: 5, Comment: "Late night Mumbai culture at its finest! Baida roti and seekh kebabs are unmatched." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Legendary street-side kebabs", "Egg-wrapped crisp Baida roti", "Smoky charcoal tandoor meats"],
    reviewTopMentions: ["Seekh Kebab", "Baida Roti", "Chicken Tikka"],
    items: [
      { name: "Mutton Seekh Kebab Roll", price: 290, description: "Minced spiced mutton skewer wrapped in soft warm rumali roti with mint chutney.", spiceLevel: "hot", stock: 60, images: [{ public_id: "bm1", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 130 },
      { name: "Chicken Baida Roti", price: 260, description: "Paratha stuffed with spiced minced chicken, sealed with egg, and pan-fried golden.", spiceLevel: "medium", stock: 50, images: [{ public_id: "bm2", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 90 },
      { name: "Tandoori Chicken Tikka", price: 320, description: "Boneless chicken chunks marinated in yoghurt and Kashmiri red chillies.", spiceLevel: "medium", stock: 45, images: [{ public_id: "bm3", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }], ratings: 4.6, numOfReviews: 80 },
    ],
  },
  {
    name: "Britannia & Co. Restaurant",
    isVeg: false,
    city: "Mumbai",
    address: "Wakefield House, 11 Sprott Road, Ballard Estate, Fort, Mumbai",
    ratings: 4.8,
    numOfReviews: 320,
    location: { type: "Point", coordinates: [72.8415, 18.9355] },
    images: [{ public_id: "britannia", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Rustom B", rating: 5, Comment: "Authentic Parsi food. The Iranian berry pulao with barberries is pure culinary art." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Heritage Parsi culinary charm", "Tangy Iranian barberries in pulao", "Velvety caramel custard"],
    reviewTopMentions: ["Berry Pulao", "Sali Boti", "Caramel Custard"],
    items: [
      { name: "Famous Mutton Berry Pulao", price: 580, description: "Aromatic basmati rice layered with slow-cooked mutton, Iranian zereshk berries, and cashews.", spiceLevel: "mild", stock: 40, images: [{ public_id: "bt1", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 150 },
      { name: "Sali Boti with Hot Pav", price: 420, description: "Tender boneless mutton cooked in sweet-and-sour tomato gravy topped with crispy potato straws.", spiceLevel: "medium", stock: 35, images: [{ public_id: "bt2", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 95 },
      { name: "Classic Caramel Custard", price: 160, description: "Silky smooth baked egg and milk custard drenched in golden amber caramel syrup.", spiceLevel: "mild", stock: 50, images: [{ public_id: "bt3", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 85 },
    ],
  },
  {
    name: "The Bombay Canteen",
    isVeg: false,
    city: "Mumbai",
    address: "Unit 1, Process House, Kamala Mills, Lower Parel, Mumbai",
    ratings: 4.8,
    numOfReviews: 260,
    location: { type: "Point", coordinates: [72.8296, 19.0069] },
    images: [{ public_id: "bombaycanteen", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Ayesha Kapoor", rating: 5, Comment: "Reinvented Indian regional cooking with incredible finesse and style." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Modern Indian culinary innovation", "Regional dishes elevated", "Stunning craft cocktails & bites"],
    reviewTopMentions: ["Eggs Kejriwal", "Canteen Haleem", "Gulab Nut"],
    items: [
      { name: "Eggs Kejriwal on Sourdough", price: 295, description: "Toasted sourdough topped with melted cheese, sunny fried eggs, and chopped green chillies.", spiceLevel: "medium", stock: 45, images: [{ public_id: "bc1", url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 80 },
      { name: "Canteen Haleem Toast", price: 385, description: "Slow-braised spiced meat pate served over crisp brioche toast with pickled onions.", spiceLevel: "medium", stock: 35, images: [{ public_id: "bc2", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 65 },
      { name: "Gulab Nut Pastry", price: 260, description: "Gulab jamun stuffed donut soaked in old monk rum with pistachio cream.", spiceLevel: "mild", stock: 40, images: [{ public_id: "bc3", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 55 },
    ],
  },
  {
    name: "Sardar Refreshments",
    isVeg: true,
    city: "Mumbai",
    address: "166-A, Tardeo Road, Junction, Tardeo, Mumbai",
    ratings: 4.7,
    numOfReviews: 390,
    location: { type: "Point", coordinates: [72.8152, 18.9710] },
    images: [{ public_id: "sardar", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Hardik Mehta", rating: 5, Comment: "Sardar's pav bhaji with that giant block of Amul butter is heaven in every bite!" },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Amul butter loaded bhaji", "Fluffy roasted pav", "Ultimate Mumbai street food classic"],
    reviewTopMentions: ["Butter Pav Bhaji", "Cheese Pav Bhaji", "Masala Pav"],
    items: [
      { name: "Amul Butter Pav Bhaji", price: 210, description: "Rich vegetable mash swimming in melted Amul butter served with two soft roasted pavs.", spiceLevel: "medium", stock: 120, images: [{ public_id: "sr1", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 210 },
      { name: "Cheese Burst Pav Bhaji", price: 260, description: "Classic spicy bhaji smothered with a lavish mountain of grated processed cheese.", spiceLevel: "medium", stock: 90, images: [{ public_id: "sr2", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 120 },
      { name: "Masala Pav (Pair)", price: 110, description: "Soft bakery buns toasted on tawa with spicy tomato-garlic masala and fresh coriander.", spiceLevel: "hot", stock: 80, images: [{ public_id: "sr3", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 70 },
    ],
  },
  {
    name: "Pizza By The Bay",
    isVeg: false,
    city: "Mumbai",
    address: "143, Soona Mahal, Marine Drive, Churchgate, Mumbai",
    ratings: 4.8,
    numOfReviews: 310,
    location: { type: "Point", coordinates: [72.8236, 18.9322] },
    images: [{ public_id: "pizzabay", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Zainab Merchant", rating: 5, Comment: "Iconic Marine Drive location with unbeatable pizza crust and Italian gelato." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Gourmet thin-crust pizzas", "Seafront dining prestige", "Authentic Italian desserts"],
    reviewTopMentions: ["Bombay Herb Pizza", "Truffle Fettuccine", "Tiramisu"],
    items: [
      { name: "Bombay Herb Gourmet Pizza", price: 540, description: "Crisp crust with spiced marinara, bell peppers, jalapeños, and fresh mozzarella.", spiceLevel: "medium", stock: 40, images: [{ public_id: "pb1", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 95 },
      { name: "Creamy Truffle Fettuccine", price: 510, description: "Fresh pasta ribbons tossed in creamy black truffle butter with aged parmesan.", spiceLevel: "mild", stock: 35, images: [{ public_id: "pb2", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 70 },
      { name: "Classic Italian Tiramisu", price: 290, description: "Espresso soaked ladyfingers layered with mascarpone mousse and cocoa powder.", spiceLevel: "mild", stock: 45, images: [{ public_id: "pb3", url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 85 },
    ],
  },

  // ===================== DELHI (5) =====================
  {
    name: "Karim's",
    isVeg: false,
    city: "Delhi",
    address: "16, Gali Kababian, Jama Masjid, Old Delhi",
    ratings: 4.9,
    numOfReviews: 460,
    location: { type: "Point", coordinates: [77.2338, 28.6507] },
    images: [{ public_id: "karims", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Tariq Khan", rating: 5, Comment: "Serving the recipes of the royal Mughal kitchens since 1913. Mutton korma is pure bliss." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Royal Mughlai recipes since 1913", "Melt in mouth mutton korma", "Historic Chandni Chowk aroma"],
    reviewTopMentions: ["Mutton Korma", "Seekh Kebab", "Tandoori Roti"],
    items: [
      { name: "Mutton Korma Badshahi", price: 380, description: "Royal Mughal gravy slow-braised with tender mutton and whole hand-ground spices.", spiceLevel: "medium", stock: 60, images: [{ public_id: "k1", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 180 },
      { name: "Karim's Shahi Seekh Kebab", price: 310, description: "Charcoal skewered minced spiced meat with mint chutney and pickled onions.", spiceLevel: "medium", stock: 55, images: [{ public_id: "k2", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 110 },
      { name: "Khamiri Roti (2 Pcs)", price: 70, description: "Traditional yeast fermented tandoor bread brushed with melted ghee.", spiceLevel: "mild", stock: 120, images: [{ public_id: "k3", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 60 },
    ],
  },
  {
    name: "Bukhara - ITC Maurya",
    isVeg: false,
    city: "Delhi",
    address: "ITC Maurya, Sardar Patel Marg, Diplomatic Enclave, Chanakyapuri, New Delhi",
    ratings: 4.9,
    numOfReviews: 390,
    location: { type: "Point", coordinates: [77.1722, 28.5971] },
    images: [{ public_id: "bukhara", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Sunil Grover", rating: 5, Comment: "World famous Dal Bukhara simmered for 18 hours. Truly one of the world's greatest restaurants." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["18-hour slow cooked Dal Bukhara", "Grand tandoori delicacies", "Global Michelin-caliber dining"],
    reviewTopMentions: ["Dal Bukhara", "Sikandari Raan", "Naan Bukhara"],
    items: [
      { name: "Dal Bukhara (18-Hour Simmer)", price: 520, description: "Black lentils slow-cooked over charcoal embers for eighteen hours with tomatoes, butter, and cream.", spiceLevel: "mild", stock: 80, images: [{ public_id: "bk1", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 220 },
      { name: "Sikandari Raan", price: 690, description: "Whole leg of spring lamb marinated in malt vinegar and spices, slow-roasted in clay tandoor.", spiceLevel: "medium", stock: 25, images: [{ public_id: "bk2", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 95 },
      { name: "Giant Naan Bukhara", price: 280, description: "Massive hand-stretched tandoori naan baked over the clay oven and buttered.", spiceLevel: "mild", stock: 60, images: [{ public_id: "bk3", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 80 },
    ],
  },
  {
    name: "Gulati Restaurant",
    isVeg: false,
    city: "Delhi",
    address: "6, Pandara Road Market, India Gate, New Delhi",
    ratings: 4.8,
    numOfReviews: 420,
    location: { type: "Point", coordinates: [77.2366, 28.6074] },
    images: [{ public_id: "gulati", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Manish Chawla", rating: 5, Comment: "The benchmark for Delhi Butter Chicken! Rich, velvety, with just the right sweetness." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Delhi's most revered Butter Chicken", "Melt-in-mouth Kakori kebabs", "Heritage dining near India Gate"],
    reviewTopMentions: ["Butter Chicken", "Kakori Kebab", "Dal Makhani"],
    items: [
      { name: "Award-Winning Butter Chicken", price: 480, description: "Tender tandoor-roasted chicken in silky rich tomato-butter makhani sauce.", spiceLevel: "medium", stock: 85, images: [{ public_id: "g1", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 210 },
      { name: "Kakori Melt-in-Mouth Kebab", price: 420, description: "Supremely delicate lamb mince infused with royal saffron and rose water.", spiceLevel: "medium", stock: 45, images: [{ public_id: "g2", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 120 },
      { name: "Creamy Dal Makhani Handi", price: 340, description: "Slow-cooked black urad lentils enriched with white butter and aromatic spices.", spiceLevel: "mild", stock: 70, images: [{ public_id: "g3", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 95 },
    ],
  },
  {
    name: "Saravanaa Bhavan",
    isVeg: true,
    city: "Delhi",
    address: "P-15, Connaught Circus, Connaught Place, New Delhi",
    ratings: 4.7,
    numOfReviews: 380,
    location: { type: "Point", coordinates: [77.2185, 28.6315] },
    images: [{ public_id: "saravana", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Ramesh Iyer", rating: 5, Comment: "Authentic Chennai taste right in the heart of Delhi. Ghee roast dosa is perfection." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Pure vegetarian South Indian", "Crisp paper roast and ghee dosas", "Madras filter coffee excellence"],
    reviewTopMentions: ["Ghee Roast Dosa", "Mini Tiffin", "Filter Kaapi"],
    items: [
      { name: "Special Ghee Roast Masala Dosa", price: 180, description: "Paper-thin crispy dosa brushed with pure ghee and stuffed with spiced potato masala.", spiceLevel: "mild", stock: 100, images: [{ public_id: "sb1", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 160 },
      { name: "Saravanaa Mini Tiffin Platter", price: 230, description: "Mini masala dosa, two soft idlis, one medu vada, sweet kesari, and filter coffee.", spiceLevel: "mild", stock: 80, images: [{ public_id: "sb2", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 130 },
      { name: "Authentic Madras Filter Coffee", price: 65, description: "Frothy South Indian coffee decoction served in traditional brass dabarah.", spiceLevel: "mild", stock: 120, images: [{ public_id: "sb3", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 95 },
    ],
  },
  {
    name: "The Big Chill Cafe",
    isVeg: false,
    city: "Delhi",
    address: "68-A, Khan Market, Rabindra Nagar, New Delhi",
    ratings: 4.8,
    numOfReviews: 350,
    location: { type: "Point", coordinates: [77.2281, 28.6003] },
    images: [{ public_id: "bigchill", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Simran Sethi", rating: 5, Comment: "Penne vodka pasta and Mississippi Mud Pie are absolute Delhi cult staples." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Comfort Italian pasta and bakes", "Rich decadent bakery pies", "Khan Market retro vibe"],
    reviewTopMentions: ["Penne Vodka", "Mississippi Mud Pie", "Belgian Chocolate Shake"],
    items: [
      { name: "Penne Vodka Pasta", price: 490, description: "Penne tossed in pink creamy tomato sauce infused with fresh basil and parmesan.", spiceLevel: "medium", stock: 45, images: [{ public_id: "bc1", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 125 },
      { name: "Belgian Chocolate Thick Shake", price: 290, description: "Ultra-thick milkshake made with pure imported Belgian dark chocolate.", spiceLevel: "mild", stock: 50, images: [{ public_id: "bc2", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 85 },
      { name: "Mississippi Mud Pie", price: 310, description: "Layered chocolate crumb crust, dense chocolate pudding, and whipped cream.", spiceLevel: "mild", stock: 40, images: [{ public_id: "bc3", url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 110 },
    ],
  },

  // ===================== HYDERABAD (5) =====================
  {
    name: "Paradise Biryani",
    isVeg: false,
    city: "Hyderabad",
    address: "Sapphire Court, SD Road, Secunderabad, Hyderabad",
    ratings: 4.8,
    numOfReviews: 490,
    location: { type: "Point", coordinates: [78.4983, 17.4411] },
    images: [{ public_id: "paradise", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Syed Quadri", rating: 5, Comment: "World famous since 1953. The Hyderabadi mutton dum biryani aroma brings nostalgia every time." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["World famous Hyderabadi Biryani", "Golden long grain dum rice", "Classic Nizam culinary legacy"],
    reviewTopMentions: ["Mutton Biryani", "Chicken 65", "Double Ka Meetha"],
    items: [
      { name: "Hyderabadi Special Mutton Dum Biryani", price: 360, description: "Nizami recipe slow-cooked over wood charcoal with marinated mutton and saffron basmati.", spiceLevel: "hot", stock: 90, images: [{ public_id: "pb1", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 240 },
      { name: "Authentic Chicken 65", price: 280, description: "Crispy chicken tossed in curry leaves, green chillies, and Hyderabadi red spice blend.", spiceLevel: "hot", stock: 70, images: [{ public_id: "pb2", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 130 },
      { name: "Hyderabadi Double Ka Meetha", price: 140, description: "Fried bread pudding soaked in saffron-cardamom condensed milk and dry fruits.", spiceLevel: "mild", stock: 60, images: [{ public_id: "pb3", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 90 },
    ],
  },
  {
    name: "Bawarchi Restaurant",
    isVeg: false,
    city: "Hyderabad",
    address: "Beside Sandhya Theatre, RTC X Roads, Chikkadpally, Hyderabad",
    ratings: 4.9,
    numOfReviews: 520,
    location: { type: "Point", coordinates: [78.4975, 17.4042] },
    images: [{ public_id: "bawarchi", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Kiran Reddy", rating: 5, Comment: "The RTC X Roads Bawarchi is the real deal! Spicy, fragrant, and bursting with meat." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["RTC Cross Roads original landmark", "Piping hot authentic dum biryani", "Tender succulent meat cuts"],
    reviewTopMentions: ["Chicken Biryani", "Mutton Boti Kebab", "Mirchi Ka Salan"],
    items: [
      { name: "Bawarchi Special Chicken Biryani", price: 310, description: "Authentic spicy dum biryani served with spicy Mirchi Ka Salan and creamy Raita.", spiceLevel: "hot", stock: 110, images: [{ public_id: "bw1", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 280 },
      { name: "Mutton Boti Kebab", price: 340, description: "Succulent mutton chunks char-grilled with crushed pepper and royal cumin.", spiceLevel: "hot", stock: 50, images: [{ public_id: "bw2", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 120 },
      { name: "Tangdi Kebab (4 Pcs)", price: 290, description: "Chicken drumsticks marinated in aromatic yoghurt paste and slow-roasted in tandoor.", spiceLevel: "medium", stock: 65, images: [{ public_id: "bw3", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 90 },
    ],
  },
  {
    name: "Chutneys",
    isVeg: true,
    city: "Hyderabad",
    address: "Road No. 3, Banjara Hills, Hyderabad",
    ratings: 4.8,
    numOfReviews: 360,
    location: { type: "Point", coordinates: [78.4357, 17.4277] },
    images: [{ public_id: "chutneys", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Deepa Rao", rating: 5, Comment: "The signature 6 chutneys and Guntur Babai idlis are unmatched for morning breakfast!" },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Signature 6-7 exotic chutneys", "Steaming soft Babai idlis", "Crispy ghee MLA Pesarattu"],
    reviewTopMentions: ["Babai Idli", "MLA Pesarattu", "Corn Cheese Dosa"],
    items: [
      { name: "Babai Hotel Ghee Idli", price: 160, description: "Button idlis drenched in pure cow ghee and gun powder served with 6 distinct chutneys.", spiceLevel: "mild", stock: 90, images: [{ public_id: "ct1", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 140 },
      { name: "MLA Pesarattu with Upma", price: 190, description: "Nutritious green gram crepe stuffed with ginger upma and served hot.", spiceLevel: "medium", stock: 70, images: [{ public_id: "ct2", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 110 },
      { name: "Corn Cheese Dosa", price: 210, description: "Golden crispy crepe stuffed with sweet corn kernels and melted mozzarella.", spiceLevel: "mild", stock: 50, images: [{ public_id: "ct3", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 75 },
    ],
  },
  {
    name: "Pista House",
    isVeg: false,
    city: "Hyderabad",
    address: "Charminar Road, Shalibanda, Old City, Hyderabad",
    ratings: 4.9,
    numOfReviews: 470,
    location: { type: "Point", coordinates: [78.4747, 17.3616] },
    images: [{ public_id: "pistahouse", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Mohd Zubair", rating: 5, Comment: "The world GI-tagged Hyderabadi Haleem king. Pure ghee, mutton, and spices cooked to perfection." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["GI-tagged world famous Haleem", "Zafrani royal biryani", "Traditional Hyderabadi sweets"],
    reviewTopMentions: ["Mutton Haleem", "Zafrani Biryani", "Qubani Ka Meetha"],
    items: [
      { name: "World Famous Hyderabadi Mutton Haleem", price: 280, description: "Slow-pounded mutton cooked for 12 hours with wheat, lentils, ghee, cashews, and fried onions.", spiceLevel: "medium", stock: 120, images: [{ public_id: "ph1", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 310 },
      { name: "Zafrani Mutton Biryani", price: 370, description: "Tender goat meat infused with Kashmiri saffron milk and long grain basmati rice.", spiceLevel: "hot", stock: 75, images: [{ public_id: "ph2", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 160 },
      { name: "Authentic Qubani Ka Meetha", price: 150, description: "Classic dessert made of dried apricots stewed with sweet syrup and topped with fresh malai.", spiceLevel: "mild", stock: 65, images: [{ public_id: "ph3", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 110 },
    ],
  },
  {
    name: "Shah Ghouse Hotel & Restaurant",
    isVeg: false,
    city: "Hyderabad",
    address: "Near RTA Office, Tolichowki, Hyderabad",
    ratings: 4.7,
    numOfReviews: 380,
    location: { type: "Point", coordinates: [78.4116, 17.3992] },
    images: [{ public_id: "shahghouse", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Wasim Akram", rating: 5, Comment: "Midnight biryani cravings are best answered here. Rich, spicy and authentic taste." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Late night dining favorite", "Generous mutton portions", "Rich spicy Hyderabadi masala"],
    reviewTopMentions: ["Special Biryani", "Malai Tikka", "Irani Chai"],
    items: [
      { name: "Shah Ghouse Special Mutton Biryani", price: 340, description: "Fiery spicy Hyderabad mutton biryani cooked to golden aromatic perfection.", spiceLevel: "hot", stock: 85, images: [{ public_id: "sg1", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 180 },
      { name: "Chicken Malai Tikka", price: 290, description: "Boneless chicken marinated with cream, cheese, cardamom, and roasted over coals.", spiceLevel: "mild", stock: 55, images: [{ public_id: "sg2", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 95 },
      { name: "Irani Chai & Osmania Biscuits (Pair)", price: 70, description: "Thick caramelized milk tea served with crisp melt-in-mouth salt biscuits.", spiceLevel: "mild", stock: 150, images: [{ public_id: "sg3", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 140 },
    ],
  },

  // ===================== PUNE (3) =====================
  {
    name: "Vaishali Restaurant",
    isVeg: true,
    city: "Pune",
    address: "1218/1, Fergusson College Road, Shivajinagar, Pune",
    ratings: 4.9,
    numOfReviews: 440,
    location: { type: "Point", coordinates: [73.8427, 18.5186] },
    images: [{ public_id: "vaishali", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Gautam Joshi", rating: 5, Comment: "Iconic Pune landmark! SPDP and Mysore masala dosa here are legendary among generations." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["FC Road legendary hangout", "Crisp SPDP chaat", "South Indian comfort fare"],
    reviewTopMentions: ["SPDP", "Mysore Masala Dosa", "Filter Coffee"],
    items: [
      { name: "Vaishali Special SPDP", price: 130, description: "Sev Potato Dahi Puri loaded with tangy tamarind chutney, sweet curd, and fine nylon sev.", spiceLevel: "mild", stock: 100, images: [{ public_id: "vs1", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 240 },
      { name: "Mysore Masala Dosa", price: 150, description: "Crisp dosa lined with spicy garlic-red chutney and filled with seasoned potato bhaji.", spiceLevel: "medium", stock: 80, images: [{ public_id: "vs2", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 180 },
      { name: "Filter Kaapi", price: 50, description: "Hot frothy South Indian filter coffee in traditional stainless steel tumbler.", spiceLevel: "mild", stock: 110, images: [{ public_id: "vs3", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 120 },
    ],
  },
  {
    name: "Kayani Bakery",
    isVeg: true,
    city: "Pune",
    address: "6, East Street, Hulshur, Camp, Pune",
    ratings: 4.8,
    numOfReviews: 390,
    location: { type: "Point", coordinates: [73.8785, 18.5152] },
    images: [{ public_id: "kayani", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Pallavi Kulkarni", rating: 5, Comment: "World-famous Shrewsbury biscuits that melt in your mouth. Always top notch!" },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Heritage Parsi bakery since 1955", "Unrivaled buttery Shrewsbury biscuits", "Rich spongy Mawa cake"],
    reviewTopMentions: ["Shrewsbury Biscuits", "Mawa Cake", "Walnut Brownie"],
    items: [
      { name: "World Famous Shrewsbury Biscuits (400g)", price: 240, description: "Legendary melt-in-mouth crisp butter cookies baked to vintage perfection.", spiceLevel: "mild", stock: 80, images: [{ public_id: "ky1", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 290 },
      { name: "Royal Mawa Cake", price: 180, description: "Rich, dense traditional Parsi cardamom-infused sponge cake made with fresh evaporated milk solids.", spiceLevel: "mild", stock: 60, images: [{ public_id: "ky2", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 140 },
      { name: "Walnut Chocolate Brownie Slice", price: 90, description: "Fudgy rich dark chocolate cake studded with roasted California walnuts.", spiceLevel: "mild", stock: 50, images: [{ public_id: "ky3", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 80 },
    ],
  },
  {
    name: "German Bakery",
    isVeg: false,
    city: "Pune",
    address: "292, North Main Road, Koregaon Park, Pune",
    ratings: 4.7,
    numOfReviews: 320,
    location: { type: "Point", coordinates: [73.8967, 18.5362] },
    images: [{ public_id: "germanbakery", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Shantanu Sen", rating: 5, Comment: "Bohemian vibes, superb apple strudel and hot kheema pav. Quintessential Pune!" },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Koregaon Park bohemian hub", "Authentic European bakes", "Spicy comforting kheema pav"],
    reviewTopMentions: ["Apple Strudel", "Kheema Pav", "Iced Hazelnut Coffee"],
    items: [
      { name: "Classic Apple Strudel with Cream", price: 240, description: "Flaky puff pastry stuffed with spiced cinnamon apples, raisins, and sweet cream.", spiceLevel: "mild", stock: 40, images: [{ public_id: "gb1", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 85 },
      { name: "Chicken Kheema Pav", price: 270, description: "Slow-simmered spicy minced chicken served with butter-toasted bakery pav.", spiceLevel: "medium", stock: 50, images: [{ public_id: "gb2", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 75 },
      { name: "Iced Hazelnut Cold Coffee", price: 190, description: "Fresh espresso blended with chilled milk, hazelnut syrup, and vanilla ice cream.", spiceLevel: "mild", stock: 65, images: [{ public_id: "gb3", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 90 },
    ],
  },

  // ===================== CHENNAI (3) =====================
  {
    name: "Murugan Idli Shop",
    isVeg: true,
    city: "Chennai",
    address: "77-1/A, GN Chetty Road, T. Nagar, Chennai",
    ratings: 4.9,
    numOfReviews: 490,
    location: { type: "Point", coordinates: [80.2415, 13.0425] },
    images: [{ public_id: "murugan", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Senthil Nathan", rating: 5, Comment: "Softest Mallipoo idlis in the world with 4 different fresh chutneys and fiery podi." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Pillow-soft Mallipoo idlis", "Ghee Podi Dosa sensation", "Iconic Madurai Jigarthanda"],
    reviewTopMentions: ["Mallipoo Idli", "Ghee Podi Uttapam", "Jigarthanda"],
    items: [
      { name: "Steamed Mallipoo Idlis (Pair)", price: 95, description: "Ultra-soft steaming jasmine-white idlis served with 4 signature chutneys and sambar.", spiceLevel: "mild", stock: 120, images: [{ public_id: "mi1", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 5.0, numOfReviews: 320 },
      { name: "Ghee Podi Onion Uttapam", price: 165, description: "Thick fermented rice pancake sprinkled with fiery gunpowder and caramelized onions.", spiceLevel: "medium", stock: 85, images: [{ public_id: "mi2", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 180 },
      { name: "Madurai Special Jigarthanda", price: 110, description: "Refreshing traditional drink made of almond gum, reduced milk, nannari syrup, and ice cream.", spiceLevel: "mild", stock: 90, images: [{ public_id: "mi3", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 130 },
    ],
  },
  {
    name: "Anjappar Chettinad Restaurant",
    isVeg: false,
    city: "Chennai",
    address: "7/2, Nungambakkam High Road, Nungambakkam, Chennai",
    ratings: 4.8,
    numOfReviews: 390,
    location: { type: "Point", coordinates: [80.2452, 13.0604] },
    images: [{ public_id: "anjappar", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Karthik Subramanian", rating: 5, Comment: "Authentic Chettinad spice mastery. The black pepper chicken and mutton chukka are top tier." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Legendary Chettinad spices since 1964", "Fiery black pepper chicken", "Seeraga Samba aromatic biryani"],
    reviewTopMentions: ["Pepper Chicken", "Mutton Chukka", "Chettinad Biryani"],
    items: [
      { name: "Chettinad Pepper Chicken Masala", price: 310, description: "Chicken cooked in freshly roasted Tellicherry black peppercorns and fennel gravy.", spiceLevel: "hot", stock: 75, images: [{ public_id: "aj1", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 175 },
      { name: "Mutton Chukka Varuval", price: 360, description: "Tender boneless mutton roasted dry with shallots, curry leaves, and Chettinad spice paste.", spiceLevel: "hot", stock: 55, images: [{ public_id: "aj2", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 120 },
      { name: "Mutton Seeraga Samba Biryani", price: 350, description: "Traditional Tamil Nadu biryani cooked with fragrant tiny seeraga samba rice and tender goat meat.", spiceLevel: "hot", stock: 60, images: [{ public_id: "aj3", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 140 },
    ],
  },
  {
    name: "Sangeetha Veg Restaurant",
    isVeg: true,
    city: "Chennai",
    address: "No. 7, Gandhi Nagar, 2nd Main Road, Adyar, Chennai",
    ratings: 4.7,
    numOfReviews: 340,
    location: { type: "Point", coordinates: [80.2568, 13.0067] },
    images: [{ public_id: "sangeetha", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80" }],
    reviews: [
      { name: "Vijayalakshmi R", rating: 5, Comment: "Consistently delicious vegetarian South Indian food. Clean, fast, and satisfying." },
    ],
    reviewSentiment: "Positive",
    reviewSummaryBullets: ["Banana leaf grand thali", "Crispy rava onion dosas", "Rich almond badam halwa"],
    reviewTopMentions: ["South Indian Meals", "Rava Onion Dosa", "Badam Halwa"],
    items: [
      { name: "Grand South Indian Meals", price: 220, description: "Traditional feast with steamed rice, sambar, vatha kuzhambu, rasam, kootu, poriyal, appalam, and payasam.", spiceLevel: "mild", stock: 90, images: [{ public_id: "sg1", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80" }], ratings: 4.8, numOfReviews: 150 },
      { name: "Rava Onion Masala Dosa", price: 155, description: "Crispy semolina lattice crepe studded with roasted onions, cashews, and cumin.", spiceLevel: "mild", stock: 70, images: [{ public_id: "sg2", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }], ratings: 4.7, numOfReviews: 95 },
      { name: "Ghee Badam Halwa", price: 120, description: "Decadent sweet made with crushed California almonds, pure ghee, and saffron.", spiceLevel: "mild", stock: 50, images: [{ public_id: "sg3", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" }], ratings: 4.9, numOfReviews: 80 },
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

    console.log(`Seeding ${sampleRestaurants.length} iconic real restaurants across 6 major cities...`);

    for (const restData of sampleRestaurants) {
      const { items: restItems, ...restaurantFields } = restData;
      const restaurant = await Restaurant.create(restaurantFields);

      const createdItems = [];
      for (const itemData of restItems) {
        const item = await FoodItem.create({
          ...itemData,
          restaurant: restaurant._id,
        });
        createdItems.push(item);
      }

      await Menu.create({
        restaurant: restaurant._id,
        menu: [
          {
            category: "Signature Dishes",
            items: createdItems.map((item) => item._id),
          },
        ],
      });

      console.log(`✓ Seeded ${restaurant.name} (${restaurant.city}) with ${createdItems.length} menu items`);
    }

    console.log(`\nSUCCESS: All ${sampleRestaurants.length} restaurants and menus successfully seeded into MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeder error:", err);
    process.exit(1);
  }
};

seedData();
