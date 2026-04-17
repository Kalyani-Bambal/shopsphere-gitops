const products = [
  { name: "Mobile", category: "Electronics" },
  { name: "Sofa", category: "Furniture" },
  { name: "T-Shirt", category: "Clothes" },
];

function ProductList() {
  return (
    <div>
      {products.map((p, i) => (
        <div key={i}>
          <h3>{p.name}</h3>
          <p>{p.category}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;