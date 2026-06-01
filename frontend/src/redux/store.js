import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./slices/restaurantSlice";
import menuReducer from "./slices/menuSlice.js";
import userReducer from "./slices/userSlice.js";
import cartReducer from "./slices/cartSlice.js";
import orderReducer from "./slices/orderSlice.js";

const store = configureStore({
  reducer: {
    restaurants: restaurantReducer,
    menus: menuReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
