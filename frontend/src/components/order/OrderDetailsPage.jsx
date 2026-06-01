import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { getOrderDetails } from "../../redux/actions/orderAction";
import { clearErrors } from "../../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, order } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const {
    _id,
    deliveryInfo = {},
    orderItems = [],
    paymentInfo = {},
    user = {},
    finalTotal,
    orderStatus,
  } = order || {};

  const deliveryDetails = deliveryInfo
    ? `${deliveryInfo.address || ""}, ${deliveryInfo.city || ""}, ${
        deliveryInfo.postalCode || ""
      }, ${deliveryInfo.country || ""}`
    : "";
  const isPaid = paymentInfo?.status === "paid";

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className="row d-flex justify-content-between orderdetails">
        <div className="col-12 col-lg-8 mt-1 order-details">
          <h1 className="my-5">Order # {_id}</h1>

          <h4 className="mb-4">Delivery Info</h4>
          <p>
            <b>Name:</b> {user?.name || "N/A"}
          </p>
          <p>
            <b>Phone:</b> {deliveryInfo?.phoneNo || "N/A"}
          </p>
          <p className="mb-4">
            <b>Address:</b> {deliveryDetails || "N/A"}
          </p>

          <p>
            <b>Amount:</b> {"\u20B9"}{Number(finalTotal || 0).toFixed(2)}
          </p>

          <hr />

          <h4 className="my-4">
            Payment :
            <span className={isPaid ? "greenColor" : "redColor"}>
              <b>{isPaid ? " PAID" : " NOT PAID"}</b>
            </span>
          </h4>

          <h4 className="my-4">
            Order Status :
            <span
              className={
                orderStatus?.includes("Delivered") ? "greenColor" : "redColor"
              }
            >
              <b>{orderStatus || "Pending"}</b>
            </span>
          </h4>

          <h4 className="my-4">Order Items:</h4>
          <hr />

          <div className="cart-item my-1">
            {orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <div key={`${item.fooditem || item.name}-${index}`} className="row my-5">
                  <div className="col-4 col-lg-2">
                    <img src={item.image} alt={item.name} height="45" width="65" />
                  </div>

                  <div className="col-5 col-lg-5">{item.name}</div>

                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p>{"\u20B9"}{Number(item.price || 0).toFixed(2)}</p>
                  </div>

                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <p>{item.quantity} Item(s)</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>

          <hr />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderDetailsPage;
