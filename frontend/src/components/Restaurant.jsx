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
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <Link
          to={`/eats/stores/${restaurant._id}/menus`}
          className="btn btn-block"
        >
          <img
            className="card-img-top mx-auto"
            src={restaurant.images?.[0]?.url || "/images/template.jpeg"}
            alt={restaurant.name}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge badge-pill badge-light text-dark font-weight-bold" style={{ border: "1px solid #ddd", fontSize: "0.78rem", padding: "0.3rem 0.6rem" }}>
              📍 {restaurant.city || "Bangalore"}
            </span>
            <span className={`badge badge-pill font-weight-bold ${restaurant.isVeg ? "badge-success" : "badge-secondary"}`} style={{ fontSize: "0.72rem", padding: "0.3rem 0.6rem" }}>
              {restaurant.isVeg ? "🟢 Pure Veg" : "🔴 Non-Veg"}
            </span>
          </div>

          <h5 className="card-title font-weight-bold mb-1">{restaurant.name}</h5>
          <p className="rest_address text-muted mb-2" style={{ fontSize: "0.85rem", lineHeight: "1.3" }}>{restaurant.address}</p>

          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(restaurant.ratings / 5) * 100}%` }}
              ></div>
            </div>

            <span id="no_of_reviews">
              ({reviewCount} Reviews)
            </span>
          </div>

          {hasInsights ? (
            <div className="ai-insights-card mt-3">
              <div className="ai-insights-title">AI Insights</div>
              <div className="ai-insights-sentiment">
                Sentiment: <strong>{sentiment || "neutral"}</strong>
              </div>

              {bullets.length > 0 ? (
                <ul className="ai-insights-list">
                  {bullets.map((bullet, index) => (
                    <li key={`${restaurant._id}-insight-${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {topMentions.length > 0 ? (
                <div className="ai-insights-top">
                  Top: {topMentions.join(", ")}
                </div>
              ) : null}
            </div>
          ) : null}

          {isAdmin && reviewCount > 0 && !hasInsights ? (
            <button
              className="btn btn-outline-success btn-sm mt-3"
              onClick={() => onAnalyze?.(restaurant._id)}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Generate AI Insights"}
            </button>
          ) : null}

          {isAdmin ? (
            <button
              className="btn btn-danger btn-sm mt-3"
              onClick={() => onDelete?.(restaurant._id)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
