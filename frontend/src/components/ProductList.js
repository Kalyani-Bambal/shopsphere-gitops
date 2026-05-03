import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

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
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to load products. Check your connection.");
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setSelectedCategory("All");

    if (term === "") {
      setFilteredProducts(products);
    } else {
      const results = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
      setFilteredProducts(results);
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
    window.dispatchEvent(new Event("storage"));
    alert(`✅ ${product.name} added to cart!`);
  };

  return (
    <div className="products-container">
      <div className="hero-banner">
        <h1>🎯 ShopZone - Your Favorite Online Store</h1>
        <p>Discover thousands of products at amazing prices with fast delivery!</p>
      </div>

      {error && <div className="error">❌ {error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search products (e.g., 'Nokia', 'Jeans', 'Kajal')..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {!searchTerm && (
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {searchTerm && (
        <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#e8f4f8", borderRadius: "4px" }}>
          <p>🔎 Search Results for "<strong>{searchTerm}</strong>" - Found {filteredProducts.length} items</p>
        </div>
      )}

      <div className="products-header">
        <h2>📦 Available Products ({filteredProducts.length})</h2>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>❌ No products found</h3>
          <p>{searchTerm ? `for "${searchTerm}"` : "in this category"}. Try another search or category!</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {product.image && product.image.startsWith("http") ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-icon">{product.image}</div>
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-category">{product.category}</div>
                {product.rating && (
                  <div className="product-rating">⭐ {product.rating} / 5</div>
                )}
                <div className="product-price">₹{product.price.toLocaleString()}</div>
              </div>
              <button onClick={() => addToCart(product)}>🛒 Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
