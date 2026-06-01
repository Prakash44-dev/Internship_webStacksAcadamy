import React, { useEffect } from "react";
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
  const itemsSubtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.foodItem.price),
    0,
  );
  const deliveryCharge = cartItems.length > 0 ? 55 : 0;
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
    dispatch(removeItemFromCart(id));
    toast.success("Item removed from cart");
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) {
      toast.error("Exceeded stock limit");
      return;
    }
    dispatch(updateCartQuantity(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(updateCartQuantity(id, newQty));
    } else {
      toast.error("Minimum quantity reached");
    }
  };

  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    dispatch(startPayment(cartItems));
  };

  return (
    <>
      {loading ? (
        <h2 className="mt-5">Loading cart...</h2>
      ) : error ? (
        <h2 className="mt-5">{error}</h2>
      ) : cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is empty</h2>
      ) : (
        <>
          <h2 className="mt-5">
            Your Cart:{" "}
            <b>
              {cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)}{" "}
              items
            </b>
          </h2>
          <h3 className="mt-5">
            Restaurant: <b>{restaurantInfo?.name}</b>
          </h3>

          <div className="row d-flex justify-content-between cartt">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="row">
                    <div className="col-4 col-lg-3">
                      <img
                        src={item.foodItem.images[0].url}
                        alt="items"
                        height="90"
                        width="115"
                      />
                    </div>

                    <div className="col-5 col-lg-3">{item.foodItem.name}</div>

                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p id="card_item_price">
                        {"\u20B9"}
                        {item.foodItem.price}
                      </p>
                    </div>

                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <div className="stockCounter d-inline">
                        <span
                          className="btn btn-danger minus"
                          onClick={() =>
                            decreaseQty(item.foodItem._id, item.quantity)
                          }
                        >
                          -
                        </span>

                        <input
                          type="number"
                          className="form-control count d-inline"
                          value={item.quantity}
                          readOnly
                        />

                        <span
                          className="btn btn-primary plus"
                          onClick={() =>
                            increaseQty(
                              item.foodItem._id,
                              item.quantity,
                              item.foodItem.stock,
                            )
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>

                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                      <i
                        id="delete_cart_item"
                        className="fa fa-trash btn btn-danger"
                        onClick={() => removeCartItemHandler(item.foodItem._id)}
                      ></i>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />

                <p>
                  Subtotal:
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0,
                    )}
                    (Units)
                  </span>
                </p>

                <p>
                  Total:
                  <span className="order-summary-values">
                    {"\u20B9"}
                    {itemsSubtotal.toFixed(2)}
                  </span>
                </p>

                <p>
                  Delivery:
                  <span className="order-summary-values">
                    {"\u20B9"}
                    {deliveryCharge.toFixed(2)}
                  </span>
                </p>

                <p>
                  Payable:
                  <span className="order-summary-values">
                    {"\u20B9"}
                    {totalDue.toFixed(2)}
                  </span>
                </p>

                <hr />

                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block"
                  onClick={checkoutHandler}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? "Redirecting..." : "Check Out"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
