import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import { logout } from "../../redux/actions/userAction";
import { clearCart, fetchCartItems } from "../../redux/actions/cartAction";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await dispatch(logout());
    dispatch(clearCart());
    navigate("/users/login");
  };

  const showSearch =
    location.pathname === "/" ||
    location.pathname.startsWith("/eats/stores/search/");

  return (
    <nav className="navbar row sticky-top align-items-center mx-0">
      <div className="col-12 col-md-3 text-center text-md-left">
        <Link to="/" className="d-inline-block">
          <img src="/images/logo.webp" alt="Food Order Logo" className="logo" />
        </Link>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        {showSearch ? <Search /> : null}
      </div>

      <div className="col-12 col-md-3 mt-3 mt-md-0 text-center">
        <div className="d-flex justify-content-center justify-content-md-end align-items-center">
          <Link to="/cart" className="text-decoration-none">
            <span className="ml-3" id="cart">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartCount}
            </span>
          </Link>

          {isAuthenticated && user ? (
            <div className="user-menu ml-4" ref={menuRef}>
              <button
                type="button"
                className="user-menu-trigger"
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <img
                  src={user?.avatar?.url || "/images/images.png"}
                  alt={user?.name || "User avatar"}
                  className="avatar avatar-nav"
                />
                <span className="user-menu-name">
                  {user?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {isMenuOpen ? (
                <div className="user-menu-dropdown">
                  <Link
                    to="/eats/orders/me/myOrders"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link to="/users/me" onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link
                    to="/users/me/update"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Update Profile
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/users/login" className="btn ml-4" id="login_btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
