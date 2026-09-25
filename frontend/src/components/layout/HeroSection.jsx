import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedCity } from "../../redux/slices/restaurantSlice";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCity = "All", count = 27 } = useSelector(
    (state) => state.restaurants
  );

  const quickDishes = [
    { label: "Biryani", query: "Biryani" },
    { label: "Dosa", query: "Dosa" },
    { label: "Butter Chicken", query: "Butter Chicken" },
    { label: "Pav Bhaji", query: "Pav Bhaji" },
    { label: "Haleem", query: "Haleem" },
    { label: "Ice Cream", query: "Chocolate" },
  ];

  const handleCitySelect = (city) => {
    localStorage.setItem("cityOverridden", "true");
    dispatch(setSelectedCity(city));
  };

  const handleQuickSearch = (keyword) => {
    navigate(`/eats/stores/search/${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="agentic-hero-section">
      <div className="agentic-hero-glow agentic-hero-glow-1" />
      <div className="agentic-hero-glow agentic-hero-glow-2" />

      <div className="agentic-hero-content text-center">
        {/* Luminous Status Badge */}
        <div className="agentic-badge-wrapper mb-3">
          <div className="agentic-live-badge">
            <span className="agentic-live-dot" />
            <span className="agentic-live-text">NEOCULINARY NETWORK ACTIVE</span>
            <span className="agentic-badge-divider">/</span>
            <span className="agentic-badge-city">
              {selectedCity === "All" ? "ALL 6 METROS" : selectedCity.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="agentic-hero-title">
          Taste The Legends.
          <br />
          <span className="agentic-gradient-text">
            Powered By Culinary Intelligence.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="agentic-hero-subtitle mx-auto">
          From Bangalore’s buttery Vidyarthi Bhavan to Old Delhi’s royal Karim’s.
          Discover 27 legendary culinary institutions with real-time taste radar,
          curated menus, and instant delivery.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="agentic-quick-pills mt-3 d-flex flex-wrap justify-content-center align-items-center">
          <span className="agentic-quick-label mr-2">Trending Cravings:</span>
          {quickDishes.map((dish) => (
            <button
              key={dish.label}
              type="button"
              className="agentic-pill-btn"
              onClick={() => handleQuickSearch(dish.query)}
            >
              🔥 {dish.label}
            </button>
          ))}
        </div>

        {/* 4 Agentic Telemetry Metric Cards */}
        <div className="agentic-metrics-grid mt-4">
          <div className="agentic-metric-card">
            <div className="agentic-metric-icon">⚡</div>
            <div className="agentic-metric-value">24-35m</div>
            <div className="agentic-metric-label">Average Hyperlocal Dispatch</div>
          </div>

          <div className="agentic-metric-card">
            <div className="agentic-metric-icon">⭐</div>
            <div className="agentic-metric-value">4.88 / 5</div>
            <div className="agentic-metric-label">Curated Gourmet Ratings</div>
          </div>

          <div className="agentic-metric-card">
            <div className="agentic-metric-icon">🏛️</div>
            <div className="agentic-metric-value">{count || 27}+</div>
            <div className="agentic-metric-label">Iconic Real Restaurants</div>
          </div>

          <div className="agentic-metric-card">
            <div className="agentic-metric-icon">🤖</div>
            <div className="agentic-metric-value">AI Radar</div>
            <div className="agentic-metric-label">Live Sentiment & Taste Insights</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
