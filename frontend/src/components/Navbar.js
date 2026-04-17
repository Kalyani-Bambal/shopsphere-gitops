import React from "react";

function Navbar() {
  return (
    <nav>
      <h2>ShopSphere</h2>
      <input type="text" placeholder="Search products..." />
      <div>
        <button>Home</button>
        <button>Menu</button>
        <button>Orders</button>
        <button>Cart</button>
        <button>Payment</button>
      </div>
    </nav>
  );
}

export default Navbar;