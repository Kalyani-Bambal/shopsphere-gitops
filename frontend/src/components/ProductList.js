import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://backend-service:5000/products")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div>
      <h2>🛍️ Products</h2>

      {products.length === 0 ? (
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