import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
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
    <div className="kage-page-container">
      {/* Search Header Banner (when searching) or Kage Hero Section (default) */}
      {keyword ? (
        <div className="agentic-search-banner mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <span className="search-query-tag font-mono">SEARCH QUERY:</span>
              <h2 className="search-query-title font-weight-bold">“{keyword}”</h2>
              <span className="search-matches-pill font-mono">
                {visibleRestaurants.length} kitchens found in {selectedCity === "All" ? "All Metros" : selectedCity}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-light btn-sm mt-3 mt-md-0 rounded-pill font-weight-bold px-3 py-2"
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
        <>
          <HeroSection />

          {/* =========================================================
              CHAPTER 01: THE APPROACH (KAGE EDITORIAL SECTION)
              ========================================================= */}
          <section id="chapter-approach" className="kage-editorial-sec mb-5">
            <div className="kage-sec-header">
              <span className="kage-sec-num font-mono">CHAPTER 01</span>
              <span className="kage-sec-rule" />
              <span className="kage-sec-tag font-mono">THE APPROACH</span>
            </div>

            <div className="row align-items-start mt-4">
              <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                <h2 className="kage-sec-title">
                  TWO THOUSAND YEARS OF CULINARY ARCHITECTURE.
                  <br />
                  <span className="kage-title-accent">PRESERVED UNDER THE NIGHT SKY.</span>
                </h2>
                <div className="kage-stats-strip mt-4">
                  <div className="kage-stat-item">
                    <span className="stat-val font-mono">900°</span>
                    <span className="stat-desc font-mono">Dum Pukht Clay Oven</span>
                  </div>
                  <div className="kage-stat-item">
                    <span className="stat-val font-mono">27</span>
                    <span className="stat-desc font-mono">Living Grandmasters</span>
                  </div>
                  <div className="kage-stat-item">
                    <span className="stat-val font-mono">14</span>
                    <span className="stat-desc font-mono">Spice Terroirs</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <p className="kage-sec-body-lead">
                  Each dish dispatched through Food Order is an unbroken ancestral lineage.
                  From the Nizams' slow-dum earthen pots in Hyderabad to the crispy golden
                  ghee-roast tavas of Malleshwaram in Bangalore, our kitchens observe sacred rituals of heat, brass, and stone.
                </p>
                <p className="kage-sec-body mt-3">
                  We bridge the time-honored techniques of India's culinary grandmasters with
                  hyperlocal delivery telemetry and artificial intelligence taste profiling. No shortcuts.
                  No artificial pastes. Just living culinary monuments delivered hot to your doorstep.
                </p>
                <a href="#kitchens-console" className="kage-editorial-link mt-4 d-inline-flex">
                  <span>Explore The Living Kitchens</span>
                  <span className="link-circle">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* =========================================================
              CHAPTER 02: THE SACRED HEARTH (THE FOUR ELEMENTAL FORCES)
              ========================================================= */}
          <section id="chapter-flame" className="kage-editorial-sec mb-5">
            <div className="kage-sec-header">
              <span className="kage-sec-num font-mono">CHAPTER 02</span>
              <span className="kage-sec-rule" />
              <span className="kage-sec-tag font-mono">THE SACRED HEARTH</span>
            </div>

            <div className="kage-cards-grid mt-4">
              <div className="kage-hearth-card">
                <div className="kage-hearth-media">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80"
                    alt="Dum Pukht"
                  />
                  <span className="kage-hearth-tag font-mono">TECHNIQUE 01</span>
                </div>
                <div className="kage-hearth-body">
                  <h4>Dum Pukht (Slow Earthen Seal)</h4>
                  <p>
                    6-hour slow simmer in hand-molded clay handis sealed with wheat dough, trapping vapor, fragrant saffron, and pure meat essences.
                  </p>
                </div>
              </div>

              <div className="kage-hearth-card">
                <div className="kage-hearth-media">
                  <img
                    src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700&auto=format&fit=crop&q=80"
                    alt="Tandoori Embers"
                  />
                  <span className="kage-hearth-tag font-mono">TECHNIQUE 02</span>
                </div>
                <div className="kage-hearth-body">
                  <h4>Tandoori Embers (White-Hot Core)</h4>
                  <p>
                    Vertical clay cylinder fired by seasoned hardwood charcoal, caramelizing ancestral garlic-yogurt marinades in seconds.
                  </p>
                </div>
              </div>

              <div className="kage-hearth-card">
                <div className="kage-hearth-media">
                  <img
                    src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700&auto=format&fit=crop&q=80"
                    alt="Cast-Iron Searing"
                  />
                  <span className="kage-hearth-tag font-mono">TECHNIQUE 03</span>
                </div>
                <div className="kage-hearth-body">
                  <h4>Tava & Kadhai (Cast-Iron Searing)</h4>
                  <p>
                    Heavy seasoned iron releasing natural botanical oils from hand-ground roasted spices with blistering butter-tava caramelization.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              CHAPTER 03: THE BOTANICAL SPICE ARCHIVE
              ========================================================= */}
          <section id="chapter-spices" className="kage-editorial-sec mb-5">
            <div className="kage-sec-header">
              <span className="kage-sec-num font-mono">CHAPTER 03</span>
              <span className="kage-sec-rule" />
              <span className="kage-sec-tag font-mono">THE BOTANICAL VAULT</span>
            </div>

            <div className="row mt-4">
              {[
                {
                  name: "Wayanad Cardamom",
                  region: "Western Ghats, Kerala",
                  note: "Citrus, eucalyptus & sweet floral aroma",
                  icon: "🌿",
                },
                {
                  name: "Pampore Saffron",
                  region: "Kashmir Valley",
                  note: "Grade-1 Mongra dark crimson threads",
                  icon: "🌸",
                },
                {
                  name: "Guntur Sannam Chili",
                  region: "Andhra Pradesh",
                  note: "Blistering heat & deep smoky fruitiness",
                  icon: "🌶️",
                },
                {
                  name: "Alleppey Turmeric",
                  region: "Kerala Coastline",
                  note: "5.5% high-curcumin golden earthiness",
                  icon: "🟡",
                },
              ].map((spice, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-lg-3 my-2">
                  <div className="kage-spice-card">
                    <span className="spice-icon">{spice.icon}</span>
                    <h5 className="spice-name">{spice.name}</h5>
                    <span className="spice-region font-mono">{spice.region}</span>
                    <p className="spice-note">{spice.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* =========================================================
          CHAPTER 04: THE GRAND BANQUET (COMMAND CONSOLE & KITCHENS)
          ========================================================= */}
      <section id="kitchens-console" className="kage-editorial-sec">
        <div className="kage-sec-header">
          <span className="kage-sec-num font-mono">CHAPTER 04</span>
          <span className="kage-sec-rule" />
          <span className="kage-sec-tag font-mono">THE GRAND BANQUET</span>
        </div>

        {/* Glossy Metro Command Console */}
        <div className="agentic-console my-4">
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
                <strong>{visibleRestaurants.length}</strong> living kitchens active in{" "}
                <span className="stat-city-highlight">
                  {selectedCity === "All" ? "all cities" : selectedCity}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        {restaurantsLoading ? (
          <Loader />
        ) : restaurantsError ? (
          <Message variant="danger">{restaurantErrorMessage}</Message>
        ) : (
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
              <div className="col-12 text-center p-5">
                <Message variant="info">No restaurants found matching your criteria.</Message>
              </div>
            )}

            {isAdmin ? (
              <div className="col-sm-12 col-md-6 col-lg-4 my-3">
                <button
                  type="button"
                  className="card admin-add-card p-4 rounded-xl"
                  onClick={() => setShowCreateModal(true)}
                >
                  <span className="admin-add-card__icon">+</span>
                  <span className="admin-add-card__label">Add Heritage Restaurant</span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* Admin Create Restaurant Modal */}
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
    </div>
  );
};

export default Home;
