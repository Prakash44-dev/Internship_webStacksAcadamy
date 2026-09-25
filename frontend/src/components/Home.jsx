import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setSelectedCity,
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import {
  analyzeRestaurantReviews,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
} from "../redux/actions/restaurantAction";
import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import CountRestaurant from "./CountRestaurant";
import HeroSection from "./layout/HeroSection";

const initialRestaurantForm = {
  name: "",
  address: "",
  isVeg: false,
  coordinates: "",
  imageUrl: "",
};

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState(initialRestaurantForm);

  const {
    loading: restaurantsLoading,
    error: restaurantsError,
    restaurants,
    showVegOnly,
    selectedCity = "All",
    creating,
    deleting,
    analyzing,
  } = useSelector((state) => state.restaurants);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const restaurantErrorMessage =
    typeof restaurantsError === "string"
      ? restaurantsError
      : restaurantsError?.message || "Something went wrong";
  const isAdmin = isAuthenticated && user?.role === "admin";
  const visibleRestaurants = useMemo(
    () =>
      restaurants?.filter((restaurant) => !showVegOnly || restaurant.isVeg) || [],
    [restaurants, showVegOnly],
  );

  // Auto-select user's registered city when logged in if not explicitly overridden
  useEffect(() => {
    if (isAuthenticated && user?.city && !localStorage.getItem("cityOverridden")) {
      dispatch(setSelectedCity(user.city));
    }
  }, [isAuthenticated, user?.city, dispatch]);

  useEffect(() => {
    dispatch(getAllRestaurants({ keyword, city: selectedCity }));
  }, [dispatch, keyword, selectedCity]);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };

  const handleCreateRestaurant = async (event) => {
    event.preventDefault();

    try {
      await dispatch(createRestaurant(restaurantForm)).unwrap();
      toast.success("Restaurant created successfully");
      setRestaurantForm(initialRestaurantForm);
      setShowCreateModal(false);
    } catch (error) {
      toast.error(error || "Unable to create restaurant");
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!window.confirm("Delete this restaurant and its related data?")) {
      return;
    }

    try {
      await dispatch(deleteRestaurant(restaurantId)).unwrap();
      toast.success("Restaurant deleted");
    } catch (error) {
      toast.error(error || "Unable to delete restaurant");
    }
  };

  const handleAnalyzeReviews = async (restaurantId) => {
    try {
      await dispatch(analyzeRestaurantReviews(restaurantId)).unwrap();
      toast.success("AI insights generated");
    } catch (error) {
      toast.error(error || "Unable to analyze restaurant reviews");
    }
  };

  return (
    <>
      {/* Hero Section displayed on default browse mode */}
      {keyword ? (
        <div className="agentic-search-banner mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <span className="search-query-tag">Search query:</span>
              <h2 className="search-query-title">“{keyword}”</h2>
              <span className="search-matches-pill">
                {visibleRestaurants.length} kitchens found in {selectedCity === "All" ? "All Metros" : selectedCity}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-light btn-sm mt-2 mt-md-0"
              onClick={() => {
                dispatch(setSelectedCity("All"));
                window.location.href = "/";
              }}
            >
              ✕ Clear Search
            </button>
          </div>
        </div>
      ) : (
        <HeroSection />
      )}

      {/* Agentic Command Console */}
      <div className="agentic-console mb-4">
        {/* City Switcher Tabs */}
        <div className="agentic-city-tabs">
          <div className="agentic-city-tabs-scroll">
            {[
              { id: "All", label: "All Metros", icon: "🌐", count: "27" },
              { id: "Bangalore", label: "Bangalore", icon: "📍", count: "6" },
              { id: "Mumbai", label: "Mumbai", icon: "📍", count: "5" },
              { id: "Delhi", label: "Delhi NCR", icon: "📍", count: "5" },
              { id: "Hyderabad", label: "Hyderabad", icon: "📍", count: "5" },
              { id: "Pune", label: "Pune", icon: "📍", count: "3" },
              { id: "Chennai", label: "Chennai", icon: "📍", count: "3" },
            ].map((cityItem) => {
              const isActive =
                selectedCity.toLowerCase() === cityItem.id.toLowerCase();
              return (
                <button
                  key={cityItem.id}
                  type="button"
                  className={`agentic-city-tab ${isActive ? "active" : ""}`}
                  onClick={() => {
                    localStorage.setItem("cityOverridden", "true");
                    dispatch(setSelectedCity(cityItem.id));
                  }}
                >
                  <span className="tab-icon">{cityItem.icon}</span>
                  <span className="tab-label">{cityItem.label}</span>
                  <span className="tab-count">{cityItem.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Sorting Controls */}
        <div className="agentic-filter-bar mt-3 d-flex justify-content-between align-items-center flex-wrap">
          <div className="agentic-quick-filters d-flex align-items-center flex-wrap">
            <button
              type="button"
              className={`agentic-filter-toggle ${showVegOnly ? "active veg-active" : ""}`}
              onClick={handleToggleVegOnly}
            >
              <span className="filter-dot veg-dot" />
              {showVegOnly ? "Pure Veg Active" : "Pure Veg Only"}
            </button>

            <button
              type="button"
              className="agentic-filter-toggle"
              onClick={handleSortByRatings}
            >
              <span className="filter-star">★</span> Highest Rated
            </button>

            <button
              type="button"
              className="agentic-filter-toggle"
              onClick={handleSortByReviews}
            >
              <span className="filter-chat">💬</span> Most Reviewed
            </button>
          </div>

          <div className="agentic-results-stat mt-2 mt-md-0">
            <span className="stat-pulse" />
            <span className="stat-text">
              <strong>{visibleRestaurants.length}</strong> restaurants active in{" "}
              <span className="stat-city-highlight">
                {selectedCity === "All" ? "all cities" : selectedCity}
              </span>
            </span>
          </div>
        </div>
      </div>

      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantErrorMessage}</Message>
      ) : (
        <section>

          <div className="row mt-4">
            {visibleRestaurants.length > 0 ? (
              visibleRestaurants.map((restaurant) => (
                <Restaurant
                  key={restaurant._id}
                  restaurant={restaurant}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteRestaurant}
                  deleting={deleting}
                  onAnalyze={handleAnalyzeReviews}
                  analyzing={analyzing}
                />
              ))
            ) : (
              <Message variant="info">No restaurants found.</Message>
            )}

            {isAdmin ? (
              <div className="col-sm-12 col-md-6 col-lg-3 my-3">
                <button
                  type="button"
                  className="card admin-add-card p-3 rounded"
                  onClick={() => setShowCreateModal(true)}
                >
                  <span className="admin-add-card__icon">+</span>
                  <span className="admin-add-card__label">Add Restaurant</span>
                </button>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {showCreateModal ? (
        <div className="create-modal" onClick={() => setShowCreateModal(false)}>
          <div
            className="create-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Create Restaurant</h2>

            <form onSubmit={handleCreateRestaurant}>
              <div className="form-group">
                <label htmlFor="restaurant-name">Name</label>
                <input
                  id="restaurant-name"
                  className="form-control"
                  value={restaurantForm.name}
                  onChange={(event) =>
                    setRestaurantForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-address">Address</label>
                <input
                  id="restaurant-address"
                  className="form-control"
                  value={restaurantForm.address}
                  onChange={(event) =>
                    setRestaurantForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group admin-checkbox">
                <label htmlFor="restaurant-veg">Pure Veg</label>
                <input
                  id="restaurant-veg"
                  type="checkbox"
                  checked={restaurantForm.isVeg}
                  onChange={(event) =>
                    setRestaurantForm((current) => ({
                      ...current,
                      isVeg: event.target.checked,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-coordinates">Coordinates (lat,lng)</label>
                <input
                  id="restaurant-coordinates"
                  className="form-control"
                  placeholder="e.g. 12.9716,77.5946"
                  value={restaurantForm.coordinates}
                  onChange={(event) =>
                    setRestaurantForm((current) => ({
                      ...current,
                      coordinates: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-image">Image URL</label>
                <input
                  id="restaurant-image"
                  className="form-control"
                  placeholder="https://..."
                  value={restaurantForm.imageUrl}
                  onChange={(event) =>
                    setRestaurantForm((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="admin-modal-actions">
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Home;
