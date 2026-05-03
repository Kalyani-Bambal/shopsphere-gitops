import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "All",
    "Clothes",
    "Mobiles",
    "Beauty",
    "Home Accessories",
    "Furniture",
    "Electronics",
    "Travel",
    "Gaming Accessories",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://backend-service:5000/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to load products. Check your connection.");
      // Use mock data for demo
      const mockProducts = [
        { id: 1, name: "T-Shirt", category: "Clothes", price: 499, image: "👕" },
        { id: 2, name: "Jeans", category: "Clothes", price: 1299, image: "👖" },
        { id: 3, name: "iPhone 14", category: "Mobiles", price: 79999, image: "📱" },
        { id: 4, name: "Samsung Galaxy", category: "Mobiles", price: 49999, image: "📱" },
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div>
      <h2>🛍️ Products</h2>

      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: "2rem", overflowX: "auto", whiteSpace: "nowrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? "#3498db" : "#bdc3c7",
              marginRight: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((p, i) => (
          <div key={i} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <button>Add to Cart</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductList;