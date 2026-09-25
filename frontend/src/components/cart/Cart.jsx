import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeItemFromCart,
  updateCartQuantity,
} from "../../redux/actions/cartAction";
import { startPayment } from "../../redux/actions/orderAction";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems, restaurantInfo, loading, error } = useSelector(
    (state) => state.cart,
  );
  const { paymentLoading, paymentError } = useSelector((state) => state.order);

  const validCartItems = (cartItems || []).filter(
    (item) => item && item.foodItem && typeof item.foodItem === "object"
  );

  const itemsSubtotal = validCartItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.foodItem.price || 0),
    0,
  );
  const deliveryCharge = validCartItems.length > 0 ? 55 : 0;
  const totalDue = itemsSubtotal + deliveryCharge;

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError);
    }
  }, [paymentError]);

  const removeCartItemHandler = (id) => {
    if (!id) return;
    dispatch(removeItemFromCart(id));
    toast.success("Item removed from cart");
  };

  const increaseQty = (id, quantity, stock) => {
    if (!id) return;
    const newQty = quantity + 1;
    if (newQty > stock) {
      toast.error("Exceeded stock limit");
      return;
    }
    dispatch(updateCartQuantity(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    if (!id) return;
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(updateCartQuantity(id, newQty));
    } else {
      toast.error("Minimum quantity reached");
    }
  };

  const checkoutHandler = () => {
    if (validCartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    dispatch(startPayment(validCartItems));
  };

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="mt-3 text-secondary font-mono">Syncing culinary dispatch buffer...</p>
        </div>
      ) : error ? (
        <div className="agentic-empty-state my-5 text-center">
          <h3 className="text-danger">{error}</h3>
          <Link to="/" className="agentic-order-btn mt-3 d-inline-flex">
            Return to Discovery
          </Link>
        </div>
      ) : validCartItems.length === 0 ? (
        <div className="agentic-card text-center p-5 my-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "3.5rem" }}>🍽️</div>
          <h2 className="mt-3 font-weight-bold text-white">Your Dispatch Buffer is Empty</h2>
          <p className="text-muted mt-2">
            Explore our curated culinary intelligence network and select legendary dishes across India.
          </p>
          <Link to="/" className="agentic-order-btn mt-4 d-inline-flex">
            Explore Iconic Kitchens →
          </Link>
        </div>
      ) : (
        <>
          {/* Header Telemetry */}
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
            <div>
              <div className="agentic-live-badge mb-2">
                <span className="agentic-live-dot"></span>
                <span>DISPATCH BUFFER</span>
                <span className="agentic-badge-divider">•</span>
                <span className="agentic-badge-city">{restaurantInfo?.name || "Kitchen Partner"}</span>
              </div>
              <h1 className="font-weight-bold text-white" style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}>
                Active Order ({validCartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0)} items)
              </h1>
            </div>
            <Link to="/" className="btn btn-outline-light btn-sm rounded-pill px-3 py-2 mt-2 mt-md-0 font-weight-bold">
              ← Add More Items
            </Link>
          </div>

          <div className="row justify-content-between">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              {validCartItems.map((item) => (
                <div className="cart-item" key={item._id || item.foodItem?._id}>
                  <div className="row align-items-center">
                    <div className="col-4 col-sm-3 col-lg-2">
                      <img
                        src={item.foodItem?.images?.[0]?.url || "/images/template.jpeg"}
                        alt={item.foodItem?.name || "item"}
                        className="img-fluid"
                        style={{ height: "76px", width: "100%", objectFit: "cover" }}
                      />
                    </div>

                    <div className="col-8 col-sm-4 col-lg-4">
                      <h5 className="mb-1 text-white font-weight-bold" style={{ fontSize: "1.05rem" }}>
                        {item.foodItem?.name || "Unknown item"}
                      </h5>
                      <span className="badge badge-dark border border-secondary text-muted font-mono" style={{ fontSize: "0.7rem" }}>
                        ⚡ PRIORITY CHEF DISPATCH
                      </span>
                    </div>

                    <div className="col-5 col-sm-2 col-lg-2 mt-3 mt-sm-0">
                      <p id="card_item_price">
                        ₹{item.foodItem?.price ?? 0}
                      </p>
                    </div>

                    <div className="col-5 col-sm-2 col-lg-3 mt-3 mt-sm-0 text-center">
                      <div className="stockCounter">
                        <button
                          type="button"
                          className="minus"
                          onClick={() => decreaseQty(item.foodItem?._id, item.quantity)}
                        >
                          -
                        </button>

                        <input
                          type="number"
                          className="count"
                          value={item.quantity}
                          readOnly
                        />

                        <button
                          type="button"
                          className="plus"
                          onClick={() => increaseQty(item.foodItem?._id, item.quantity, item.foodItem?.stock || 0)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-2 col-sm-1 col-lg-1 mt-3 mt-sm-0 text-right">
                      <button
                        type="button"
                        id="delete_cart_item"
                        title="Remove item"
                        onClick={() => removeCartItemHandler(item.foodItem?._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Telemetry Box */}
            <div className="col-12 col-lg-4 my-3 my-lg-0">
              <div id="order_summary">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="m-0">Order Summary</h4>
                  <span className="badge badge-warning text-dark font-weight-bold font-mono px-2 py-1">
                    AGENTIC PAY
                  </span>
                </div>
                <hr />

                <div className="d-flex justify-content-between my-2">
                  <span className="text-muted">Total Units:</span>
                  <span className="order-summary-values">
                    {validCartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0)} items
                  </span>
                </div>

                <div className="d-flex justify-content-between my-2">
                  <span className="text-muted">Item Subtotal:</span>
                  <span className="order-summary-values">
                    ₹{itemsSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between my-2">
                  <span className="text-muted">Express Courier Fee:</span>
                  <span className="order-summary-values text-success">
                    ₹{deliveryCharge.toFixed(2)}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between my-3 align-items-baseline">
                  <span className="font-weight-bold text-white" style={{ fontSize: "1.1rem" }}>Final Payable:</span>
                  <span className="order-summary-values text-warning" style={{ fontSize: "1.45rem" }}>
                    ₹{totalDue.toFixed(2)}
                  </span>
                </div>

                <button
                  id="checkout_btn"
                  className="btn btn-block"
                  onClick={checkoutHandler}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? "Initiating Secure Stripe Gateway..." : "Proceed to Checkout →"}
                </button>

                <div className="text-center mt-3">
                  <small className="text-muted font-mono" style={{ fontSize: "0.72rem" }}>
                    🔒 256-Bit Encrypted Stripe Payment Gateway
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
