import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const priceInINR = (product.price * 83.5).toFixed(2); // USD to INR conversion

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-category">{product.category}</div>
      <h3 className="product-title">{product.title}</h3>
      <div className="product-price">₹{priceInINR}</div>
      <div className="product-rating">
        <span>⭐ {product.rating.rate}</span>
        <span>({product.rating.count} reviews)</span>
      </div>
    </Link>
  );
};

export default ProductCard;
