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
      <h2>🛒 ShopSphere</h2>

      <input type="text" placeholder="Search products..." />

      <div>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart {cartCount > 0 && `(${cartCount})`}</Link>
        <Link to="/payment">Checkout</Link>
      </div>
    </nav>
  );
}

export default Navbar;