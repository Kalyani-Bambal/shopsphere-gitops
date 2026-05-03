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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.cardNumber
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        customer: formData,
      };

      const response = await fetch("http://backend-service:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        localStorage.removeItem("cart");
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order");
    }
  };

  if (orderPlaced) {
    return (
      <div>
        <h2>✅ Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>💳 Checkout</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart. <a href="/">Go shopping</a></p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} style={{ marginBottom: "1rem" }}>
                <span>{item.image}</span> {item.name} x {item.quantity} = ₹
                {(item.price * item.quantity).toFixed(2)}
              </div>
            ))}
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem" }}>
              Total: ₹{calculateTotal().toFixed(2)}
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Card Number (Demo: Enter any 16 digits)</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="19"
              />
            </div>

            <button type="submit" style={{ width: "100%" }}>
              Place Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Checkout;