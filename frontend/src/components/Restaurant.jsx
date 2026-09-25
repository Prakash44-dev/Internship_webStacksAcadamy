import React from "react";
import { Link } from "react-router-dom";

const Restaurant = ({
  restaurant,
  isAdmin = false,
  onDelete,
  deleting = false,
  onAnalyze,
  analyzing = false,
}) => {
  const sentiment = (restaurant.reviewSentiment || "").toLowerCase();
  const bullets = Array.isArray(restaurant.reviewSummaryBullets)
    ? restaurant.reviewSummaryBullets
    : [];
  const topMentions = Array.isArray(restaurant.reviewTopMentions)
    ? restaurant.reviewTopMentions
    : [];
  const reviewCount = restaurant.numOfReviews ?? restaurant.reviews?.length ?? 0;
  const hasInsights = Boolean(sentiment || bullets.length > 0 || topMentions.length > 0);

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 my-3">
      <div className="agentic-card h-100 d-flex flex-column">
        {/* Media Frame with Overlay Badges */}
        <div className="agentic-card-media-wrapper">
          <Link
            to={`/eats/stores/${restaurant._id}/menus`}
            className="agentic-card-link"
          >
            <img
              className="agentic-card-img"
              src={restaurant.images?.[0]?.url || "/images/template.jpeg"}
              alt={restaurant.name}
              loading="lazy"
            />
            <div className="agentic-card-gradient-overlay" />
          </Link>

          {/* Floating Badges */}
          <div className="agentic-floating-badges top-badges">
            <span className="agentic-badge-city">
              📍 {restaurant.city || "Bangalore"}
            </span>
            <span
              className={`agentic-badge-diet ${
                restaurant.isVeg ? "diet-veg" : "diet-nonveg"
              }`}
            >
              <span className="diet-dot" />
              {restaurant.isVeg ? "PURE VEG" : "NON-VEG"}
            </span>
          </div>

          <div className="agentic-floating-badges bottom-badges">
            <span className="agentic-badge-rating">
              <span className="star-icon">★</span> {restaurant.ratings?.toFixed(1) || "4.8"}
              <span className="review-count">({reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="agentic-card-body d-flex flex-column flex-grow-1 p-3">
          <h3 className="agentic-card-title mb-1">
            <Link to={`/eats/stores/${restaurant._id}/menus`}>
              {restaurant.name}
            </Link>
          </h3>

          <p className="agentic-card-address mb-3">
            <span className="pin-symbol">⌖</span> {restaurant.address}
          </p>

          {/* AI Taste Radar / Insights */}
          {hasInsights ? (
            <div className="agentic-ai-box mb-3">
              <div className="agentic-ai-header">
                <span className="ai-sparkle">✨</span>
                <span className="ai-title">AI TASTE RADAR</span>
                <span className={`ai-sentiment-pill sentiment-${sentiment || "positive"}`}>
                  {sentiment ? sentiment.toUpperCase() : "POSITIVE"}
                </span>
              </div>

              {bullets.length > 0 ? (
                <p className="agentic-ai-summary mb-2">
                  {bullets[0]}
                </p>
              ) : null}

              {topMentions.length > 0 ? (
                <div className="agentic-ai-tags">
                  {topMentions.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="ai-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Card Footer Actions */}
          <div className="agentic-card-footer mt-auto pt-2">
            <Link
              to={`/eats/stores/${restaurant._id}/menus`}
              className="agentic-order-btn btn btn-block"
            >
              <span>Explore Menu</span>
              <span className="arrow-glide">→</span>
            </Link>

            {isAdmin && reviewCount > 0 && !hasInsights ? (
              <button
                className="btn btn-outline-info btn-sm btn-block mt-2"
                onClick={() => onAnalyze?.(restaurant._id)}
                disabled={analyzing}
              >
                {analyzing ? "Analyzing..." : "Generate AI Insights"}
              </button>
            ) : null}

            {isAdmin ? (
              <button
                className="btn btn-outline-danger btn-sm btn-block mt-2"
                onClick={() => onDelete?.(restaurant._id)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Restaurant"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
