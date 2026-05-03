import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <nav>
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          ShopZone
          <div className="nav-logo-sub">Your Online Marketplace</div>
        </Link>
        <div className="nav-search">
          <input type="text" placeholder="🔍 Search products..." />
          <button>Search</button>
        </div>
      </div>

      <div className="nav-right">
        <Link to="/">
          🏠 Home
        </Link>
        <Link to="/cart">
          🛒 Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <Link to="/payment">
          💳 Checkout
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;