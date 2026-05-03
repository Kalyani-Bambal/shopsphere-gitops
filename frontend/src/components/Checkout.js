import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return Math.round(calculateTotal() * 0.05);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.cardNumber
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const orderData = {
        items: cartItems,
        total: calculateTotal() + calculateTax(),
        customer: formData,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="success-message" style={{ textAlign: "center", padding: "2rem" }}>
          <h2>✅ Order Placed Successfully!</h2>
          <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
            Thank you for your purchase. Your order has been confirmed and will be delivered soon.
          </p>
          <p style={{ marginTop: "1rem", color: "#666" }}>
            Redirecting to home page in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 style={{ marginBottom: "2rem" }}>💳 Complete Your Order</h2>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty!</h3>
          <p>Add items to your cart before checkout.</p>
          <a href="/" style={{ textDecoration: "none" }}>
            <button style={{ marginTop: "1rem" }}>← Go Shopping</button>
          </a>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* Order Summary */}
            <div className="order-summary">
              <h3>📦 Order Summary</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div>
                      {item.image && item.image.startsWith("http") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "50px", height: "50px", objectFit: "contain", marginRight: "1rem" }}
                        />
                      ) : (
                        <span style={{ fontSize: "2rem", marginRight: "1rem" }}>{item.image}</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600" }}>{item.name}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        ₹{item.price.toLocaleString()} x {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: "600", color: "#ff9900" }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "2px solid #ddd", paddingTop: "1rem" }}>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span style={{ color: "#27ae60", fontWeight: "bold" }}>FREE 🎉</span>
                </div>
                <div className="summary-row">
                  <span>Tax (5%):</span>
                  <span>₹{calculateTax().toLocaleString()}</span>
                </div>
                <div className="order-total">
                  <span>Total Amount:</span>
                  <span>₹{(calculateTotal() + calculateTax()).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: "1.5rem" }}>📋 Delivery Information</h3>

              <div className="form-group">
                <label>👤 Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>📧 Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>🏠 Street Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-two-columns">
                <div className="form-group">
                  <label>🏙️ City/Town *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city name"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>📮 ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    placeholder="Enter ZIP code"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>💳 Card Number (Demo: Enter any 16 digits) *</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  required
                />
              </div>

              <button type="submit" className="place-order-btn">
                ✅ Place Order - ₹{(calculateTotal() + calculateTax()).toLocaleString()}
              </button>

              <a href="/cart" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    border: "1px solid #ddd",
                  }}
                >
                  ← Back to Cart
                </button>
              </a>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;