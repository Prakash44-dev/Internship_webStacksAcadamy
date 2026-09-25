import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="agentic-footer mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row align-items-center pb-4 mb-4 border-bottom border-secondary" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
          <div className="col-12 col-md-4 text-center text-md-left mb-3 mb-md-0">
            <Link to="/" className="d-inline-flex align-items-center text-decoration-none">
              <img src="/images/logo.webp" alt="Food Order Logo" className="logo mr-2" style={{ width: "36px", height: "36px" }} />
              <span className="brand-name" style={{ fontSize: "1.2rem" }}>
                Food <span className="brand-accent">Order</span>
              </span>
            </Link>
            <p className="mt-2 text-muted" style={{ fontSize: "0.82rem", maxWidth: "280px" }}>
              Hyperlocal discovery connecting India’s legendary culinary institutions with next-gen speed.
            </p>
          </div>

          <div className="col-12 col-md-5 text-center mb-3 mb-md-0">
            <span className="text-muted d-block mb-2" style={{ fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px" }}>
              LIVE CULINARY METROS
            </span>
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: "0.4rem" }}>
              {["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai"].map((city) => (
                <span key={city} className="badge badge-pill" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}>
                  📍 {city}
                </span>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-3 text-center text-md-right">
            <div className="d-inline-flex flex-column align-items-center align-items-md-end">
              <span className="badge badge-success mb-2" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#34d399", padding: "0.35rem 0.75rem", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>
                ● 100% OPERATIONAL
              </span>
              <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                Powered by Stripe & MongoDB Atlas
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-muted" style={{ fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} Food Order. Built with AI Taste Intelligence & Motional Engineering.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
