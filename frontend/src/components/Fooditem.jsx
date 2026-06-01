import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

  const cartItem = cartItems.find((item) => item.foodItem._id === fooditem._id);
  const quantity = cartItem?.quantity ?? 1;
  const showButtons = Boolean(cartItem);

  // ➖ decrease
  const decreaseQty = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(updateCartQuantity(fooditem._id, newQuantity));
    } else {
      dispatch(removeItemFromCart(fooditem._id));
    }
  };

  // ➕ increase
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      const newQuantity = quantity + 1;
      dispatch(updateCartQuantity(fooditem._id, newQuantity));
    } else {
      alert("Exceeded stock limit");
    }
  };

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      navigate("/users/login");
      return;
    }

    dispatch(addItemToCart(fooditem._id, restaurant, quantity));
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={fooditem.images?.[0]?.url || "/images/template.jpeg"}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{fooditem.name}</h5>

          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text">
            {"\u20B9"}
            {fooditem.price}
          </p>

          {!isAdmin && !showButtons ? (
            <button
              id="cart_btn"
              className="btn btn-primary ml-4"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : null}

          {!isAdmin && showButtons ? (
            <div className="stockCounter d-inline">
              <span className="btn btn-danger minus" onClick={decreaseQty}>
                -
              </span>

              <input
                type="number"
                className="form-control count d-inline"
                value={quantity}
                readOnly
              />

              <span className="btn btn-primary plus" onClick={increaseQty}>
                +
              </span>
            </div>
          ) : null}

          {isAdmin ? (
            <button
              className="btn btn-danger btn-sm mt-3"
              onClick={() => onDelete?.(fooditem._id)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          ) : null}

          <hr />

          <p>
            Status:
            <span className={fooditem.stock > 0 ? "greenColor" : "redColor"}>
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
