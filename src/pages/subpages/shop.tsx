import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import { SingleProductCard } from '../../components/ProductCard';
import './ShopPage.css';
import Footer from '@/components/Footer';
import Modal from '../../components/Modal';
import { useCart } from '../../context/CartContext';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import XiaomiLoader from '../../components/XiaomiLoader';

interface Product {
  id: string;
  title: string;
  image: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  category?: string;
  rating?: number;
}

interface CompareProduct {
  id: string;
  title: string;
  newPrice: number;
}

const Shop: NextPage = () => {
  const { addToCart } = useCart();

  // UI states
  const [view, setView] = useState<'grid' | 'list'>('grid');
  // The following states for filtering are still here, but they won't affect the product list now.
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<CompareProduct[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  // Fetch products directly from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const snapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        console.log('Fetched Products:', fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Categories and sort options are still defined for UI controls
  const categories = [
    'Home Appliances', 'Kitchen', 'Offices', 'Mobile Phones', 'TVs',
    'Laptops', 'Cameras', 'Audio', 'Gaming', 'Wearables', 'Smart Home',
    'Fitness', 'Tools', 'Automotive', 'Garden', 'Furniture', 'Lighting',
    'Storage', 'Decor', 'Accessories',
  ];

  const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'Newest Arrivals',
    'Popularity',
    'Rating: High to Low',
    'Rating: Low to High'
  ];

  // Remove filtering: use all products as-is
  const filteredProducts = products;

  // Sorting products based on sortOption
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') return a.newPrice - b.newPrice;
    if (sortOption === 'Price: High to Low') return b.newPrice - a.newPrice;
    if (sortOption === 'Rating: High to Low') return (b.rating || 0) - (a.rating || 0);
    if (sortOption === 'Rating: Low to High') return (a.rating || 0) - (b.rating || 0);
    return 0;
  });

  // Pagination / Infinite Scroll: show a subset of products
  const paginatedProducts = sortedProducts.slice(0, currentPage * itemsPerPage);

  // Wishlist functionality
  const handleAddToWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Compare toggle: store product title and newPrice for display
  const handleCompareToggle = (product: Product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, { id: product.id, title: product.title, newPrice: product.newPrice }];
      }
    });
  };

  // Quick view and recently viewed
  const handleProductClick = (product: Product) => {
    setQuickViewProduct(product);
    setRecentlyViewed((prev) => {
      const updated = [product, ...prev.filter((p) => p.id !== product.id)];
      return updated.slice(0, 5);
    });
  };

  const loadMoreProducts = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Breadcrumbs for navigation
  const breadcrumbs = [
    { label: 'Home', link: '/' },
    { label: 'Shop', link: '/shop' },
  ];

  return (
    <div>
      <Head>
        <title>Shop - Almar Designs</title>
        <meta name="description" content="Browse our products" />
      </Head>
      <NavbarPublic />
      <SubNavbar />

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <a href={crumb.link}>{crumb.label}</a>
            {index < breadcrumbs.length - 1 && ' > '}
          </span>
        ))}
      </nav>

      <main className="shop-container">
        <h1 className="shop-heading">Shop</h1>

        {/* Controls Section */}
        <div className="shop-controls">
          <input
            type="text"
            className="shop-search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="select-wrapper">
            <select
              className="shop-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="price-filter">
            <input
              type="number"
              className="price-input"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            />
            <input
              type="number"
              className="price-input"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            />
          </div>

          <div className="select-wrapper">
            <select
              className="shop-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              {sortOptions.map((sort, index) => (
                <option key={index} value={sort}>
                  {sort}
                </option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>
              Grid
            </button>
            <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>
              List
            </button>
          </div>
        </div>

        {/* Products Listing */}
        <div className={`shop-products ${view === 'list' ? 'list' : ''}`}>
          {productsLoading ? (
          <XiaomiLoader />
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product.id} className="product-wrapper">
                <div onClick={() => handleProductClick(product)}>
                  <SingleProductCard
                    product={product}
                    onAddToCart={(prod) => addToCart(prod)}
                    onRatingChange={(newRating) =>
                      console.log(`New rating for product ${product.id}: ${newRating}`)
                    }
                  />
                </div>
                <div className="product-actions">
                  <button onClick={() => handleAddToWishlist(product.id)}>Wishlist</button>
                  <label>
                    <input
                      type="checkbox"
                      checked={compareList.some((p) => p.id === product.id)}
                      onChange={() => handleCompareToggle(product)}
                    />
                    Compare
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products-message">No products available.</p>
          )}
        </div>

        {paginatedProducts.length < sortedProducts.length && (
          <button className="load-more" onClick={loadMoreProducts}>
            Load More
          </button>
        )}

        {compareList.length > 0 && (
          <div className="compare-section">
            <h2>Compare Products</h2>
            {compareList.map((prod) => (
              <div key={prod.id} className="compare-item">
                <p>
                  {prod.title} - ${prod.newPrice.toFixed(2)}
                </p>
              </div>
            ))}
            <button onClick={() => console.log('Compare products', compareList)}>Compare Now</button>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="recently-viewed">
            <h2>Recently Viewed</h2>
            <div className="recently-viewed-list">
              {recentlyViewed.map((product) => (
                <div key={product.id} className="recently-viewed-item">
                  <p>{product.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {quickViewProduct && (
          <Modal onClose={() => setQuickViewProduct(null)}>
            <div className="quick-view-content">
              <h2>{quickViewProduct.title}</h2>
              <p>Price: ${quickViewProduct.newPrice.toFixed(2)}</p>
              <p>Category: {quickViewProduct.category}</p>
              <p>Rating: {quickViewProduct.rating}</p>
              <button onClick={() => addToCart(quickViewProduct)}>Add to Cart</button>
            </div>
          </Modal>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
