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
  };

  const updateQuantity = (id, quantity) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h2>🛒 Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <span style={{ fontSize: "2rem" }}>{item.image}</span>
                <div>
                  <strong>{item.name}</strong>
                  <p>₹{item.price}</p>
                </div>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  style={{ width: "50px" }}
                />
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            Total: ₹{calculateTotal().toFixed(2)}
          </div>

          <Link to="/payment">
            <button style={{ width: "100%", marginTop: "1rem", padding: "1rem" }}>
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;