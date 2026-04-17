import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>ShopSphere</h2>

      <input type="text" placeholder="Search products..." />

      <div>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/payment">Payment</Link>
      </div>
    </nav>
  );
}

export default Navbar;