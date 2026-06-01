import api from "../../Utils/api";
import {
  cartRequest,
  cartSuccess,
  cartFailure,
  updateCartSuccess,
  removeCartSuccess,
  clearCartState,
} from "../slices/cartSlice";

const getCartErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Cart request failed";

export const fetchCartItems = () => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.get("/eats/cart/get-cart");
    dispatch(cartSuccess(data));
  } catch (error) {
    if (error.response?.status === 404) {
      dispatch(clearCartState());
      return;
    }

    dispatch(cartFailure(getCartErrorMessage(error)));
  }
};

export const addItemToCart =
  (foodItemId, restaurantId, quantity = 1) =>
  async (dispatch, getState) => {
    try {
      dispatch(cartRequest());
      const { user } = getState().user;

      if (!user?._id) {
        throw new Error("Please login to add items to cart");
      }

      const { data } = await api.post("/eats/cart/add-to-cart", {
        foodItemId,
        restaurantId,
        quantity,
      });

      dispatch(cartSuccess(data));
    } catch (error) {
      dispatch(cartFailure(getCartErrorMessage(error)));
    }
  };

export const updateCartQuantity =
  (foodItemId, quantity) => async (dispatch, getState) => {
    try {
      dispatch(cartRequest());
      const { user } = getState().user;

      if (!user?._id) {
        throw new Error("Please login to update cart");
      }

      const { data } = await api.post("/eats/cart/update-cart-item", {
        foodItemId,
        quantity,
      });

      dispatch(updateCartSuccess(data));
    } catch (error) {
      dispatch(cartFailure(getCartErrorMessage(error)));
    }
  };

export const removeItemFromCart =
  (foodItemId) => async (dispatch, getState) => {
    try {
      dispatch(cartRequest());
      const { user } = getState().user;

      if (!user?._id) {
        throw new Error("Please login to update cart");
      }

      const { data } = await api.delete("/eats/cart/delete-cart-item", {
        data: { foodItemId },
      });

      if (data?.cart) {
        dispatch(removeCartSuccess(data));
      } else {
        dispatch(clearCartState());
      }
    } catch (error) {
      dispatch(cartFailure(getCartErrorMessage(error)));
    }
  };

export const clearCart = () => (dispatch) => {
  dispatch(clearCartState());
};
