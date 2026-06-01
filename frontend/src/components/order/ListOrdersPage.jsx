import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { myOrders } from "../../redux/actions/orderAction";
import { clearErrors } from "../../redux/slices/orderSlice";
import "./ListOrders.css";

const ListOrdersPage = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="list-orders-container">
      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You have not placed any orders yet.</p>
          <Link to="/" className="btn btn-primary btn-sm">
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.restaurant?.name || "Unknown"}</td>
                  <td>{order.orderItems?.length || 0}</td>
                  <td>{"\u20B9"}{Number(order.finalTotal || 0).toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        order.orderStatus?.includes("Delivered")
                          ? "status-delivered"
                          : "status-pending"
                      }
                    >
                      {order.orderStatus || "Processing"}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/eats/orders/${order._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListOrdersPage;
