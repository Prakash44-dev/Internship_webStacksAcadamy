import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  loading: false,
  error: null,
  orders: [],
  paymentLoading: false,
  paymentError: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    createOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    paymentRequest: (state) => {
      state.paymentLoading = true;
      state.paymentError = null;
    },
    paymentSuccess: (state) => {
      state.paymentLoading = false;
    },
    paymentFailure: (state, action) => {
      state.paymentLoading = false;
      state.paymentError = action.payload;
    },
    myOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    myOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    myOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  clearErrors,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  paymentRequest,
  paymentSuccess,
  paymentFailure,
  myOrdersRequest,
  myOrdersSuccess,
  myOrdersFailure,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFailure,
} = orderSlice.actions;
export default orderSlice.reducer;
