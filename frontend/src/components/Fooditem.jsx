import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartQuantity,
} from "../redux/actions/cartAction";

const Fooditem = ({
  fooditem,
  restaurant,
  isAdmin = false,
  onDelete,
  deleting = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;

  const { cartItems } = useSelector((state) => state.cart);

  const cartItem = (cartItems || []).find(
    (item) => (item?.foodItem?._id || item?.foodItem) === fooditem?._id
  );
  const quantity = cartItem?.quantity ?? 1;
  const showButtons = Boolean(cartItem);

  // ➖ decrease
  const decreaseQty = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(updateCartQuantity(fooditem?._id, newQuantity));
    } else {
      dispatch(removeItemFromCart(fooditem?._id));
    }
  };

  // ➕ increase
  const increaseQty = () => {
    if (quantity < (fooditem?.stock || 0)) {
      const newQuantity = quantity + 1;
      dispatch(updateCartQuantity(fooditem?._id, newQuantity));
    } else {
      toast.error("Exceeded stock limit");
    }
  };

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      navigate("/users/login");
      return;
    }

    dispatch(addItemToCart(fooditem?._id, restaurant, quantity));
  };

  const spiceColor = {
    mild: "badge-info",
    medium: "badge-warning",
    hot: "badge-danger",
  }[fooditem?.spiceLevel?.toLowerCase()] || "badge-secondary";

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 my-3">
      <div className="agentic-card h-100 d-flex flex-column">
        {/* Media Frame */}
        <div className="agentic-card-media-wrapper" style={{ height: "190px" }}>
          <img
            className="agentic-card-img"
            src={fooditem?.images?.[0]?.url || "/images/template.jpeg"}
            alt={fooditem?.name || "Food Item"}
            loading="lazy"
          />
          <div className="agentic-card-gradient-overlay" />

          {/* Floating Badges */}
          <div className="agentic-floating-badges top-badges">
            <span className={`badge ${spiceColor} text-uppercase font-weight-bold`} style={{ fontSize: "0.68rem", padding: "0.25rem 0.55rem", letterSpacing: "0.5px" }}>
              🌶️ {fooditem?.spiceLevel || "MEDIUM"}
            </span>

            <span className="badge badge-pill font-weight-bold" style={{
              background: (fooditem?.stock || 0) > 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
              color: (fooditem?.stock || 0) > 0 ? "#34d399" : "#f87171",
              border: (fooditem?.stock || 0) > 0 ? "1px solid #10b981" : "1px solid #ef4444",
              fontSize: "0.68rem",
            }}>
              {(fooditem?.stock || 0) > 0 ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>

          <div className="agentic-floating-badges bottom-badges">
            <span className="agentic-card-price" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#f59e0b",
              textShadow: "0 0 12px rgba(245, 158, 11, 0.4)",
            }}>
              ₹{fooditem?.price}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="agentic-card-body d-flex flex-column flex-grow-1 p-3">
          <h4 className="agentic-card-title mb-1 text-white font-weight-bold" style={{ fontSize: "1.1rem" }}>
            {fooditem?.name}
          </h4>

          <p className="agentic-card-address mb-3 text-muted" style={{ fontSize: "0.82rem", lineHeight: "1.4" }}>
            {fooditem?.description}
          </p>

          <div className="mt-auto pt-2">
            {!isAdmin && !showButtons ? (
              <button
                className="agentic-order-btn btn btn-block"
                disabled={!fooditem?.stock || fooditem.stock === 0}
                onClick={addToCartHandler}
              >
                <span>Add to Cart</span>
                <span className="arrow-glide">+</span>
              </button>
            ) : null}

            {!isAdmin && showButtons ? (
              <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-muted font-weight-bold" style={{ fontSize: "0.8rem" }}>Quantity:</span>
                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-sm btn-outline-danger font-weight-bold"
                    onClick={decreaseQty}
                    style={{ width: "32px", height: "32px", padding: 0 }}
                  >
                    -
                  </button>
                  <span className="text-white font-weight-bold mx-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem" }}>
                    {quantity}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-success font-weight-bold"
                    onClick={increaseQty}
                    style={{ width: "32px", height: "32px", padding: 0 }}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            {isAdmin ? (
              <button
                className="btn btn-outline-danger btn-sm btn-block mt-2"
                onClick={() => onDelete?.(fooditem?._id)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Item"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
