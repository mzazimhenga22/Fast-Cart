import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../components/NavbarPublic';
import SubNavbar from '../components/SubNavbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import { useCart } from '../context/CartContext';
import styles from '../styles/Home.module.css'; // Import stylesheet

// 1. Import your BannerSlider component here:
import BannerSlider from '../components/BannerSlider';

const Home: NextPage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Additional filtering logic can be added here if needed.
  };

  return (
    <div>
      <Head>
        <title>Alama Designs Homepage</title>
        <meta name="description" content="Showcasing a wide range of products." />
      </Head>

      <NavbarPublic />
      <SubNavbar />

      {/* Flex container to hold Sidebar and Main Content */}
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          {/* Sidebar for Category Selection */}
          <div className={styles.sidebar}>
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          {/* Main Content Area */}
          <div className={styles.mainContent}>
            {/* Banner Slider will now only take up the available space on the right */}
            <BannerSlider />

            {/* Main Content Section */}
            <main style={{ padding: '2rem' }}>
              {selectedCategory ? (
                <h2>Selected Category: {selectedCategory}</h2>
              ) : (
                <h2>All Categories</h2>
              )}

              <ProductCard
                onAddToCart={addToCart}
                onRatingChange={(productId, newRating) =>
                  console.log(`New rating for ${productId}: ${newRating}`)
                }
                selectedCategory={selectedCategory}
              />
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;