import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/actions/orderAction";
import { clearCart } from "../../redux/actions/cartAction";
import { clearErrors } from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";

const OrderSuccessPage = () => {
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
      <div className="col-10 col-md-8 col-lg-6 mt-5 text-center">
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

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/eats/orders/me/myOrders">Go to Orders</Link>
          {order?._id ? <Link to={`/eats/orders/${order._id}`}>View Order</Link> : null}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
