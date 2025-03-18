// pages/search.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, ChangeEvent } from 'react';
import NavbarPublic from '../components/NavbarPublic';
import SubNavbar from '../components/SubNavbar';
import Footer from '../components/Footer';
import XiaomiLoader from '../components/XiaomiLoader';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path as needed
import { useRouter } from 'next/router';
import Link from 'next/link';
import './SearchPage.css'; // Create this CSS file for custom styling

export interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  category: string;
  specifications?: string;
}

const SearchPage: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Set search query from URL query parameter once the router is ready
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.q) {
      setSearchQuery(router.query.q as string);
    }
  }, [router.isReady, router.query.q]);

  // Live filter products based on the search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.specifications && product.specifications.toLowerCase().includes(query))
    );
  });

  // Group filtered products by category
  const groupedProducts = filteredProducts.reduce((groups: Record<string, Product[]>, product) => {
    const category = product.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  // Debug logging for troubleshooting
  useEffect(() => {
    console.log('Search Query:', searchQuery);
    console.log('Filtered Products:', filteredProducts);
  }, [searchQuery, filteredProducts]);

  return (
    <div>
      <Head>
        <title>Search Products</title>
        <meta name="description" content="Search for products" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="search-container">
        <h1>Search Products</h1>
        <input
          type="text"
          placeholder="Search products by title, category, or specs..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {loading ? (
          <XiaomiLoader />
        ) : Object.keys(groupedProducts).length === 0 ? (
          <p>No products found.</p>
        ) : (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="category-group">
              <h2 className="category-heading">{category}</h2>
              <div className="products-grid">
                {groupedProducts[category].map((product) => (
                  <div key={product.id} className="product-card">
                    <img
                      src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.title}
                      className="product-image"
                    />
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description}</p>
                    {product.specifications && (
                      <p className="product-specs">
                        <strong>Specs:</strong> {product.specifications}
                      </p>
                    )}
                    <p className="product-price">
                      <span className="old-price">${product.oldPrice.toFixed(2)}</span>{' '}
                      <span className="new-price">${product.newPrice.toFixed(2)}</span>
                    </p>
                    <Link
                      href={{
                        pathname: `/product/${product.id}`,
                        query: {
                          image: product.image,
                          title: product.title,
                          description: product.description,
                          oldPrice: product.oldPrice,
                          newPrice: product.newPrice,
                          category: product.category,
                          specifications: product.specifications || '',
                        },
                      }}
                      className="details-link"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
