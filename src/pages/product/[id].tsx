// pages/product/[id].tsx
import { useRouter } from 'next/router';
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetails.css';

export interface ProductData {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  oldPrice?: number;
  newPrice?: number;
  category?: string;
  rating?: number;
  discountPercentage?: number;
  specs?: string;
  additionalImages?: string[];
  invoiceQuantity?: number;
  availableColors?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  manufacturer?: string;
  warrantyPeriod?: string;
  releaseDate?: string;
  cartAmount?: number; // Added property for cart quantity
}

const ProductDetails: React.FC = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  if (!router.isReady) return <div>Loading...</div>;

  // Build the product object from query parameters.
  // For array values (e.g. additionalImages), we assume they were stringified.
  const product: ProductData = {
    id: router.query.id as string,
    image: router.query.image as string,
    title: router.query.title as string,
    description: router.query.description as string,
    oldPrice: router.query.oldPrice ? Number(router.query.oldPrice) : undefined,
    newPrice: router.query.newPrice ? Number(router.query.newPrice) : undefined,
    category: router.query.category as string,
    rating: router.query.rating ? Number(router.query.rating) : undefined,
    discountPercentage: router.query.discountPercentage
      ? Number(router.query.discountPercentage)
      : undefined,
    specs: router.query.specs as string,
    additionalImages: router.query.additionalImages
      ? JSON.parse(router.query.additionalImages as string)
      : [],
    invoiceQuantity: router.query.invoiceQuantity ? Number(router.query.invoiceQuantity) : undefined,
    availableColors: router.query.availableColors as string,
    weight: router.query.weight ? Number(router.query.weight) : undefined,
    dimensions: router.query.dimensions as string,
    material: router.query.material as string,
    manufacturer: router.query.manufacturer as string,
    warrantyPeriod: router.query.warrantyPeriod as string,
    releaseDate: router.query.releaseDate as string,
  };

  const wishlistItem = {
    id: product.id,
    title: product.title || '',
    price: product.newPrice ? product.newPrice.toString() : '0',
    image: product.image || '',
  };

  // State for cart amount (i.e. quantity to add)
  const [cartAmount, setCartAmount] = React.useState(1);

  return (
    <div className="product-container">
      <button className="back-button" onClick={() => router.back()}>
        &larr; Back
      </button>

      <div className="product-main">
        {/* Left Column: Main Image and Additional Images */}
        <div className="left-column">
          <img
            className="product-image"
            src={
              product.image ||
              'https://via.placeholder.com/300x200?text=No+Image'
            }
            alt={product.title || 'Product Image'}
          />
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="additional-images-gallery">
              {product.additionalImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Additional ${index + 1}`}
                  className="additional-image"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="right-column">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-category">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="product-price">
            <strong>Price:</strong> ${product.newPrice}{' '}
            {product.oldPrice && (
              <span className="old-price">${product.oldPrice}</span>
            )}
          </p>
          {product.discountPercentage && (
            <p className="product-discount">
              <strong>Discount:</strong> {product.discountPercentage}% off
            </p>
          )}
          <p className="product-rating">
            <strong>Rating:</strong> {product.rating}
          </p>
          {product.invoiceQuantity !== undefined && (
            <p className="stock-left">
              <strong>In Stock:</strong> {product.invoiceQuantity} units
            </p>
          )}
          {/* Cart Amount Input */}
          <div className="cart-quantity">
            <label htmlFor="cartAmount">Quantity:</label>
            <input
              type="number"
              id="cartAmount"
              min="1"
              value={cartAmount}
              onChange={(e) => setCartAmount(Number(e.target.value))}
            />
          </div>
          <button
            className="add-to-cart-button"
            onClick={() => {
              // Attach the selected cart amount to the product before adding to cart
              addToCart({ ...product, cartAmount });
              router.push('/subpages/cart');
            }}
          >
            Add to Cart
          </button>
          <div className="wishlist-checkout-buttons">
            <button
              className="wishlist-button"
              onClick={() => {
                addToWishlist(wishlistItem);
                router.push('/subpages/wishlist');
              }}
            >
              Add to Wishlist
            </button>
            <button
              className="checkout-button"
              onClick={() => {
                addToCart({ ...product, cartAmount });
                router.push('/subpages/checkout');
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Product Specifications Section */}
      {product.specs && (
        <div className="specifications-section">
          <h2 className="section-title">Product Specifications</h2>
          <p className="specs-text">{product.specs}</p>
        </div>
      )}

      {/* Additional Details Section */}
      <div className="additional-details-section">
        <h2 className="section-title">Additional Details</h2>
        <ul className="details-list">
          {product.availableColors && (
            <li>
              <strong>Available Colors:</strong> {product.availableColors}
            </li>
          )}
          {product.weight !== undefined && (
            <li>
              <strong>Weight:</strong> {product.weight} kg
            </li>
          )}
          {product.manufacturer && (
            <li>
              <strong>Manufacturer:</strong> {product.manufacturer}
            </li>
          )}
          {product.warrantyPeriod && (
            <li>
              <strong>Warranty Period:</strong> {product.warrantyPeriod}
            </li>
          )}
          {product.releaseDate && (
            <li>
              <strong>Release Date:</strong>{' '}
              {new Date(product.releaseDate).toLocaleDateString()}
            </li>
          )}
          {product.dimensions && (
            <li>
              <strong>Dimensions:</strong> {product.dimensions}
            </li>
          )}
          {product.material && (
            <li>
              <strong>Material:</strong> {product.material}
            </li>
          )}
        </ul>
      </div>

      {/* Shipping & Returns Section */}
      <div className="shipping-returns-section">
        <h2 className="section-title">Shipping & Returns</h2>
        <p className="section-text">
          Enjoy free shipping on orders over $50. Returns are accepted within 30
          days of purchase. For more details, please check our shipping and
          returns policy.
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
