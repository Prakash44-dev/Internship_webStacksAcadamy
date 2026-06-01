import api from "../../Utils/api";
import {
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
} from "../slices/orderSlice";

const getOrderErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export const createOrder = (sessionId) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());

    const { data } = await api.post(
      "/eats/orders/new",
      { session_id: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(createOrderSuccess(data.order));
  } catch (error) {
    dispatch(
      createOrderFailure(getOrderErrorMessage(error, "Failed to create order"))
    );
  }
};

export const startPayment = (items) => async (dispatch) => {
  try {
    dispatch(paymentRequest());

    const { data } = await api.post(
      "/payment/process",
      { items },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(paymentSuccess());

    if (!data?.url) {
      throw new Error("Stripe checkout URL was not returned");
    }

    window.location.assign(data.url);
  } catch (error) {
    dispatch(
      paymentFailure(getOrderErrorMessage(error, "Failed to start payment"))
    );
  }
};

export const myOrders = () => async (dispatch) => {
  try {
    dispatch(myOrdersRequest());
    const { data } = await api.get("/eats/orders/me/myOrders");
    dispatch(myOrdersSuccess(data.orders));
  } catch (error) {
    dispatch(myOrdersFailure(getOrderErrorMessage(error, "Failed to load orders")));
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailsRequest());
    const { data } = await api.get(`/eats/orders/${id}`);
    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(
      orderDetailsFailure(
        getOrderErrorMessage(error, "Failed to load order details")
      )
    );
  }
};
