import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMenus } from "../redux/actions/menuAction.js";
import FoodItem from "./Fooditem";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { menus, loading, error } = useSelector((state) => state.menus);
  const currentRestaurant = useSelector((state) =>
    state.restaurants?.restaurants?.find((r) => r._id === id)
  );

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong";

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  const totalItems = Array.isArray(menus)
    ? menus.reduce((acc, cat) => acc + (cat.items?.length || 0), 0)
    : 0;

  return (
    <div className="container py-4">
      {/* Back button */}
      <Link
        to="/"
        className="d-inline-flex align-items-center gap-2 text-decoration-none text-muted mb-3 font-weight-bold"
        style={{ fontSize: "0.88rem" }}
      >
        <span style={{ fontSize: "1.1rem" }}>←</span> Back to Iconic Kitchens
      </Link>

      {/* Restaurant Agentic Header Banner */}
      {currentRestaurant && (
        <div className="agentic-search-banner mb-4">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="agentic-live-badge" style={{ padding: "0.25rem 0.75rem" }}>
                  <span className="agentic-live-dot"></span>
                  <span>LIVE MENU</span>
                </span>
                <span className="agentic-badge-city">
                  📍 {currentRestaurant.location || currentRestaurant.city || "Bangalore"}
                </span>
                {currentRestaurant.isVeg ? (
                  <span className="agentic-badge-diet diet-veg">
                    <span className="diet-dot"></span> PURE VEG
                  </span>
                ) : (
                  <span className="agentic-badge-diet diet-nonveg">
                    <span className="diet-dot"></span> GOURMET
                  </span>
                )}
              </div>

              <h1 className="search-query-title text-white font-weight-bold" style={{ fontSize: "2.3rem" }}>
                {currentRestaurant.name}
              </h1>

              <p className="text-secondary mb-2" style={{ fontSize: "0.92rem" }}>
                {currentRestaurant.address || "Heritage Culinary Destination"}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                <span className="agentic-badge-rating">
                  <span className="star-icon">★</span> {currentRestaurant.ratings || "4.8"}
                  <span className="review-count">({currentRestaurant.numOfReviews || 120}+ reviews)</span>
                </span>
                <span className="text-muted font-mono" style={{ fontSize: "0.8rem" }}>
                  ⚡ Dispatch in 25-35 mins
                </span>
                <span className="text-muted font-mono" style={{ fontSize: "0.8rem" }}>
                  🍽️ {totalItems} Crafted Specialties
                </span>
              </div>
            </div>

            <div className="col-12 col-md-4 mt-3 mt-md-0 text-md-right">
              {currentRestaurant.images?.[0]?.url && (
                <img
                  src={currentRestaurant.images[0].url}
                  alt={currentRestaurant.name}
                  className="rounded-lg shadow-lg border border-secondary"
                  style={{
                    maxHeight: "130px",
                    width: "100%",
                    maxWidth: "240px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu Categories */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="mt-3 text-secondary font-mono">Synchronizing kitchen catalog...</p>
        </div>
      ) : error ? (
        <div className="agentic-empty-state my-5 text-center">
          <h3 className="text-danger">{errorMessage}</h3>
          <Link to="/" className="agentic-order-btn mt-3 d-inline-flex">
            Return to Discovery
          </Link>
        </div>
      ) : Array.isArray(menus) && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu._id} className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.3rem" }}>✨</span>
                <h2
                  className="text-white font-weight-bold m-0"
                  style={{ fontSize: "1.65rem", letterSpacing: "-0.5px" }}
                >
                  {menu.category}
                </h2>
                <span
                  className="badge badge-secondary ml-2 font-mono"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "999px",
                    padding: "0.3rem 0.7rem",
                  }}
                >
                  {menu.items?.length || 0} items
                </span>
              </div>
            </div>

            {Array.isArray(menu.items) && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <FoodItem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted font-mono">No items currently available in this category.</p>
            )}
          </div>
        ))
      ) : (
        <div className="agentic-card text-center p-5 my-5">
          <h3 className="text-white font-weight-bold">No Menu Items Listed</h3>
          <p className="text-muted mt-2">
            This kitchen is currently updating its daily seasonal recipes.
          </p>
          <Link to="/" className="agentic-order-btn mt-3 d-inline-flex">
            Explore Other Kitchens →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
