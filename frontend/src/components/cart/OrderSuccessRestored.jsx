import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/actions/orderAction";
import { clearErrors } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/actions/cartAction";
import { toast } from "react-toastify";

const OrderSuccessRestored = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const hasCalled = useRef(false);
  const { error, order } = useSelector((state) => state.order);

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId || hasCalled.current) {
      return;
    }

    hasCalled.current = true;
    dispatch(createOrder(sessionId));
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (order) {
      dispatch(clearCart());
      toast.success("Order placed successfully", {
        position: "bottom-right",
      });
    }

    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
  }, [dispatch, error, order]);

  return (
    <div className="row justify-content-center">
      <div className="col-6 mt-5 text-center">
        {order ? (
          <>
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>

            <h2>Your order has been placed successfully.</h2>
            <Link to="/eats/orders/me/myOrders">Go to My Orders</Link>
          </>
        ) : error ? (
          <>
            <h2>Payment completed, but we could not save the order yet.</h2>
            <p className="page-subtitle mt-3 mb-4">
              {error}
            </p>
            <Link to="/cart">Back to Cart</Link>
          </>
        ) : (
          <>
            <h2>Finalizing your order...</h2>
            <p className="page-subtitle mt-3">Please wait while we save your order details.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessRestored;
