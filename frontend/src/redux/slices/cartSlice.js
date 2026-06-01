import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  restaurantInfo: null,
  deliveryInfo: null,
  loading: false,
  error: null,
};

const normalizeCartPayload = (payload) => {
  const cart = payload?.cart || payload?.data || payload;

  return {
    cartItems: cart?.items || [],
    restaurantInfo: cart?.restaurant || null,
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartSuccess: (state, action) => {
      state.loading = false;
      const { cartItems, restaurantInfo } = normalizeCartPayload(action.payload);
      state.cartItems = cartItems;
      state.restaurantInfo = restaurantInfo;
    },
    cartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartSuccess: (state, action) => {
      const { cartItems, restaurantInfo } = normalizeCartPayload(action.payload);
      state.cartItems = cartItems;
      state.restaurantInfo = restaurantInfo;
      state.loading = false;
      state.error = null;
    },
    removeCartSuccess: (state, action) => {
      const { cartItems, restaurantInfo } = normalizeCartPayload(action.payload);
      state.cartItems = cartItems;
      state.restaurantInfo = cartItems.length ? restaurantInfo : null;
      state.loading = false;
      state.error = null;
    },
    clearCartState: (state) => {
      state.cartItems = [];
      state.restaurantInfo = null;
      state.deliveryInfo = null;
      state.loading = false;
      state.error = null;
    },
    saveDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
  },
});

export const {
  cartRequest,
  cartSuccess,
  cartFailure,
  updateCartSuccess,
  removeCartSuccess,
  clearCartState,
  saveDeliveryInfo,
} = cartSlice.actions;

export default cartSlice.reducer;
