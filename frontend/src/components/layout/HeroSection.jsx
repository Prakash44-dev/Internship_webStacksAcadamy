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
    { label: "Hyderabadi Biryani", query: "Biryani" },
    { label: "Crispy Masala Dosa", query: "Dosa" },
    { label: "Old Delhi Butter Chicken", query: "Butter Chicken" },
    { label: "Mumbai Pav Bhaji", query: "Pav Bhaji" },
    { label: "Royal Haleem", query: "Haleem" },
    { label: "Artisan Mithai", query: "Sweet" },
  ];

  const handleQuickSearch = (keyword) => {
    navigate(`/eats/stores/search/${encodeURIComponent(keyword)}`);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="kage-hero-section">
      {/* Background radial atmosphere */}
      <div className="kage-ambient-glow glow-top-left" />
      <div className="kage-ambient-glow glow-top-right" />

      <div className="kage-hero-container">
        {/* Top Eyebrow Badge */}
        <div className="kage-eyebrow-row">
          <span className="kage-live-dot" />
          <span className="kage-eyebrow-text font-mono">
            FOOD ORDER • THE ARCHITECTURAL CULINARY EXPERIENCE
          </span>
          <span className="kage-eyebrow-city font-mono">
            / {selectedCity === "All" ? "ALL 6 METROS" : selectedCity.toUpperCase()}
          </span>
        </div>

        {/* Grand Editorial Display Headline */}
        <h1 className="kage-display-title">
          <span className="kage-title-line">WHERE HUNGER MEETS</span>
          <span className="kage-title-line kage-title-accent">THE SACRED HEARTH.</span>
        </h1>

        {/* Editorial Subtitle Lede */}
        <p className="kage-editorial-lede">
          A nocturnal pilgrimage through India's 27 living culinary institutions.
          Charred tandoor embers, Kerala cardamom mists, and ancestral recipes
          dispatched in real-time with AI taste intelligence.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="kage-quick-cravings-row">
          <span className="kage-cravings-label font-mono">REVERED DISHES:</span>
          <div className="d-flex flex-wrap gap-2">
            {quickDishes.map((dish) => (
              <button
                key={dish.label}
                type="button"
                className="kage-glossy-pill"
                onClick={() => handleQuickSearch(dish.query)}
              >
                <span className="kage-pill-flame">🔥</span>
                <span>{dish.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Motional Chapter Chips (Kage Chapter Navigation) */}
        <div className="kage-chapters-grid mt-5">
          <div
            className="kage-chapter-chip"
            onClick={() => scrollToSection("chapter-approach")}
          >
            <span className="kage-chapter-num font-mono">01</span>
            <div className="kage-chapter-info">
              <b>THE APPROACH</b>
              <p>Threshold to India's Heritage Flavors</p>
            </div>
          </div>

          <div
            className="kage-chapter-chip"
            onClick={() => scrollToSection("chapter-flame")}
          >
            <span className="kage-chapter-num font-mono">02</span>
            <div className="kage-chapter-info">
              <b>THE SACRED HEARTH</b>
              <p>900° Dum Pukht & Ancient Clay Ovens</p>
            </div>
          </div>

          <div
            className="kage-chapter-chip"
            onClick={() => scrollToSection("chapter-spices")}
          >
            <span className="kage-chapter-num font-mono">03</span>
            <div className="kage-chapter-info">
              <b>THE SPICE ARCHIVE</b>
              <p>Curated Aromatics from 14 Terroirs</p>
            </div>
          </div>

          <div
            className="kage-chapter-chip"
            onClick={() => scrollToSection("kitchens-console")}
          >
            <span className="kage-chapter-num font-mono">04</span>
            <div className="kage-chapter-info">
              <b>THE GRAND BANQUET</b>
              <p>27 Living Legends & AI Taste Radar</p>
            </div>
          </div>
        </div>

        {/* 4 Glossy Telemetry Metric Cards */}
        <div className="kage-telemetry-row mt-4">
          <div className="kage-telemetry-card">
            <div className="kage-telemetry-glow" />
            <span className="kage-telemetry-icon">⚡</span>
            <span className="kage-telemetry-value font-mono">24-35m</span>
            <span className="kage-telemetry-label font-mono">AVERAGE DISPATCH</span>
          </div>

          <div className="kage-telemetry-card">
            <div className="kage-telemetry-glow" />
            <span className="kage-telemetry-icon">⭐</span>
            <span className="kage-telemetry-value font-mono">4.88 / 5</span>
            <span className="kage-telemetry-label font-mono">GOURMET RATING</span>
          </div>

          <div className="kage-telemetry-card">
            <div className="kage-telemetry-glow" />
            <span className="kage-telemetry-icon">🏛️</span>
            <span className="kage-telemetry-value font-mono">{count || 27}+</span>
            <span className="kage-telemetry-label font-mono">LIVING INSTITUTIONS</span>
          </div>

          <div className="kage-telemetry-card">
            <div className="kage-telemetry-glow" />
            <span className="kage-telemetry-icon">🤖</span>
            <span className="kage-telemetry-value font-mono">AI RADAR</span>
            <span className="kage-telemetry-label font-mono">SENTIMENT ANALYTICS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
