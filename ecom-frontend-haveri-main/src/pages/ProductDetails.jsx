import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="loading">Product not found</div>
      </div>
    );
  }

  const priceInINR = (product.price * 83.5).toFixed(2);

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Products
      </button>
      <div className="product-details">
        <div className="product-details-grid">
          <img
            src={product.image}
            alt={product.title}
            className="product-details-image"
          />
          <div className="product-info">
            <div className="category">{product.category}</div>
            <h1>{product.title}</h1>
            <div className="price">₹{priceInINR}</div>
            <div className="rating">
              <span>⭐ {product.rating.rate}</span>
              <span>({product.rating.count} reviews)</span>
            </div>
            <p className="description">{product.description}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              <FaShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
