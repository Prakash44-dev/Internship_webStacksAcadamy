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
    <div className="row justify-content-center py-5">
      <div className="col-11 col-md-8 col-lg-6">
        <div className="agentic-card kage-glossy-card p-4 p-md-5 text-center">
          {order ? (
            <>
              <div className="mb-4">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                  style={{ width: "72px", height: "72px", margin: "0 auto" }}
                >
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                    stroke="#F62440"
                    strokeWidth="3"
                  />
                  <path
                    className="checkmark__check"
                    fill="none"
                    stroke="#FFFAF3"
                    strokeWidth="4"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>

              <span className="kage-live-dot mb-3 d-inline-block" />
              <span className="font-mono text-uppercase d-block mb-2" style={{ color: "#FFE5BF", fontSize: "0.8rem", letterSpacing: "2px" }}>
                TRANSACTION CONFIRMED • STRIPE VERIFIED
              </span>

              <h2 className="mb-3" style={{ color: "#FFFAF3", fontWeight: 800, fontSize: "2rem" }}>
                Your Imperial Feast Has Been Dispatched
              </h2>

              <p className="mb-4" style={{ color: "#FFF2DB", fontSize: "1rem", lineHeight: 1.6 }}>
                Payment of <b style={{ color: "#FFE5BF" }}>₹{order.finalTotal || order.itemsPrice}</b> has been received via Stripe.
                Your artisanal dishes are now being prepared at the sacred hearth.
              </p>

              {order._id && (
                <div className="agentic-ai-box mb-4 text-start p-3" style={{ background: "rgba(12, 14, 24, 0.4)", border: "1px solid rgba(255, 229, 191, 0.2)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="font-mono" style={{ color: "#FFE5BF", fontSize: "0.75rem" }}>ORDER ID</span>
                    <span className="font-mono" style={{ color: "#FFFAF3", fontSize: "0.75rem" }}>#{order._id}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="font-mono" style={{ color: "#FFE5BF", fontSize: "0.75rem" }}>DELIVERY TO</span>
                    <span className="font-mono" style={{ color: "#FFF2DB", fontSize: "0.75rem" }}>
                      {order.deliveryInfo?.city || "Bangalore"}, {order.deliveryInfo?.address || "Address confirmed"}
                    </span>
                  </div>
                </div>
              )}

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link
                  to="/eats/orders/me/myOrders"
                  className="agentic-order-btn px-4 py-2 text-decoration-none"
                  style={{ minWidth: "180px" }}
                >
                  <span>View My Orders</span>
                  <span className="arrow-glide">→</span>
                </Link>

                <Link
                  to="/"
                  className="kage-glossy-pill px-4 py-2 text-decoration-none"
                  style={{ minWidth: "180px", justifyContent: "center" }}
                >
                  <span>Explore Living Kitchens</span>
                </Link>
              </div>
            </>
          ) : error ? (
            <>
              <div className="mb-3" style={{ fontSize: "3rem" }}>⚠️</div>
              <h2 className="mb-3" style={{ color: "#FFFAF3", fontWeight: 800 }}>Payment Finalization Note</h2>
              <p className="page-subtitle mt-2 mb-4" style={{ color: "#FFF2DB" }}>
                {error}
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/eats/orders/me/myOrders" className="agentic-order-btn px-4 py-2 text-decoration-none">
                  Check My Orders
                </Link>
                <Link to="/cart" className="kage-glossy-pill px-4 py-2 text-decoration-none">
                  Return to Cart
                </Link>
              </div>
            </>
          ) : (
            <div className="py-4">
              <div className="spinner-border mb-3" style={{ color: "#F62440", width: "3rem", height: "3rem" }} role="status" />
              <h2 style={{ color: "#FFFAF3", fontWeight: 800 }}>Securing Your Order...</h2>
              <p className="page-subtitle mt-2" style={{ color: "#FFF2DB" }}>
                Verifying Stripe checkout session and dispatching to kitchen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessRestored;
