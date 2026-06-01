import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { myOrders } from "../../redux/actions/orderAction";
import { clearErrors } from "../../redux/slices/orderSlice";
import "./ListOrders.css";

const ListOrdersRestored = () => {
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

  const data =
    orders?.map((order) => ({
      id: order._id,
      restaurant: order.restaurant?.name || "Unknown",
      items: order.orderItems?.length || 0,
      amount: `\u20B9${Number(order.finalTotal || 0).toFixed(2)}`,
      status: order.orderStatus || "Processing",
      date: new Date(order.createdAt).toLocaleDateString(),
    })) || [];

  return (
    <div className="list-orders-container">
      <h1 className="orders-title">My Orders</h1>

      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
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
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.restaurant}</td>
                  <td>{row.items}</td>
                  <td>{row.amount}</td>
                  <td>
                    <span
                      className={
                        row.status.includes("Delivered")
                          ? "status-delivered"
                          : "status-pending"
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <Link
                      to={`/eats/orders/${row.id}`}
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

export default ListOrdersRestored;
