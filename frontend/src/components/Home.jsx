import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
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

  useEffect(() => {
    dispatch(getAllRestaurants(keyword));
  }, [dispatch, keyword]);

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
      <CountRestaurant />

      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantErrorMessage}</Message>
      ) : (
        <section>
          <div className="sort">
            <button
              className={`sort_veg p-3 ${showVegOnly ? "is-active" : ""}`}
              onClick={handleToggleVegOnly}
            >
              {showVegOnly ? "Show All" : "Pure Veg"}
            </button>

            <button className="sort_rev p-3" onClick={handleSortByReviews}>
              Sort By Reviews
            </button>

            <button className="sort_rate p-3" onClick={handleSortByRatings}>
              Sort By Ratings
            </button>
          </div>

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
