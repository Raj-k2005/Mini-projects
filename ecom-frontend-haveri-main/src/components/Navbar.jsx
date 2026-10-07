import React from "react";
import { FaShoppingCart, FaStore, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ cartItems }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <FaStore size={24} />
          ShopEasy
        </Link>
        <div className="nav-actions">
          <button className="nav-btn">
            <FaUser size={16} />
            Sign In
          </button>
          <button className="nav-btn">
            <div className="cart-icon">
              <FaShoppingCart size={16} />
              {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
            </div>
            Cart
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
