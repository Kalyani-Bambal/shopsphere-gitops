import React from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div>
      <Navbar />
      <SearchBar />
      <ProductList />
      <Cart />
      <Checkout />
    </div>
  );
}

export default App;