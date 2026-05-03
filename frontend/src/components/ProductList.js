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
    "Furniture",
    "Travel",
    "Home Accessories",
    "Electronics",
    "Gaming Accessories",
  ];

  const categoryIcons = {
    Clothes: "👗",
    Mobiles: "📱",
    Beauty: "💄",
    Furniture: "🛋️",
    Travel: "🎒",
    "Home Accessories": "🏠",
    Electronics: "🔌",
    "Gaming Accessories": "🎮",
  };

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

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter((p) => p.category === category);
  };

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="product-card">
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
  );

  // Category Section Component (for Amazon-like layout)
  const CategorySection = ({ categoryName }) => {
    const categoryProducts = getProductsByCategory(categoryName);
    
    if (categoryProducts.length === 0) return null;

    return (
      <div className="category-section">
        <div className="category-section-header">
          <h3>{categoryIcons[categoryName]} {categoryName}</h3>
          <button 
            className="view-all-btn"
            onClick={() => handleCategoryFilter(categoryName)}
          >
            View All ({categoryProducts.length}) →
          </button>
        </div>
        <div className="category-section-grid">
          {categoryProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
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
              {cat === "All" ? "🏠 All Products" : `${categoryIcons[cat]} ${cat}`}
            </button>
          ))}
        </div>
      )}

      {searchTerm && (
        <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#e8f4f8", borderRadius: "4px" }}>
          <p>🔎 Search Results for "<strong>{searchTerm}</strong>" - Found {filteredProducts.length} items</p>
        </div>
      )}

      {/* Show category sections if "All" is selected and no search (Amazon-like layout) */}
      {selectedCategory === "All" && !searchTerm && filteredProducts.length > 0 ? (
        <div className="home-page-sections">
          {categories.map((cat) => {
            if (cat !== "All") {
              return <CategorySection key={cat} categoryName={cat} />;
            }
            return null;
          })}
        </div>
      ) : (
        // Show filtered products grid for specific category or search
        <>
          <div className="products-header">
            <h2>
              📦 {searchTerm ? `Search Results` : selectedCategory} 
              ({filteredProducts.length})
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>❌ No products found</h3>
              <p>
                {searchTerm 
                  ? `Try searching with different keywords or browse our categories!`
                  : "in this category. Try another search or category!"}
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
