import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const updateQuantity = (id, quantity) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h2>🛒 Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty!</h3>
          <p>Start adding items to your cart and they'll appear here.</p>
          <Link to="/">
            <button style={{ marginTop: "1rem" }}>← Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>Cart Items ({cartItems.length})</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image && item.image.startsWith("http") ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span>{item.image}</span>
                  )}
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="product-category">{item.category}</div>
                  <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                </div>
                <div className="cart-item-controls">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="quantity-input"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>FREE 🎉</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{Math.round(calculateTotal() * 0.05).toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total Price:</span>
              <span className="total-price">
                ₹{(calculateTotal() + Math.round(calculateTotal() * 0.05)).toLocaleString()}
              </span>
            </div>

            <Link to="/payment" style={{ textDecoration: "none" }}>
              <button className="checkout-btn">
                Proceed to Checkout →
              </button>
            </Link>

            <Link to="/" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "1px solid #ddd",
                }}
              >
                ← Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;