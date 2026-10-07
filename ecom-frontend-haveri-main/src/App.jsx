import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductListing from "./pages/ProductListing";
import ProductDetails from "./pages/ProductDetails";

const App = () => {
  const [cartItems, setCartItems] = useState(0);

  const handleAddToCart = (product) => {
    setCartItems((prev) => prev + 1);
    alert(`${product.title} added to cart!`);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar cartItems={cartItems} />
        <Routes>
          <Route path="/" element={<ProductListing />} />
          <Route
            path="/product/:id"
            element={<ProductDetails onAddToCart={handleAddToCart} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
