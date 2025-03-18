import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import ProductCard from '../../components/ProductCard';
import { 
  Home, 
  Kitchen, 
  Work, 
  PhoneAndroid, 
  Tv, 
  Laptop, 
  CameraAlt, 
  Headphones, 
  SportsEsports, // replaced SportsGaming
  Watch, 
  HomeRepairService, 
  FitnessCenter, 
  Build, 
  DirectionsCar, 
  LocalFlorist, 
  Weekend,        // replaced Couch
  Lightbulb, 
  Archive, 
  Brush, 
  Diamond 
} from '@mui/icons-material';

import './Categories.css';

const categories = [
  { id: 1, name: "Home Appliances", icon: <Home /> },
  { id: 2, name: "Kitchen", icon: <Kitchen /> },
  { id: 3, name: "Offices", icon: <Work /> },
  { id: 4, name: "Mobile Phones", icon: <PhoneAndroid /> },
  { id: 5, name: "TVs", icon: <Tv /> },
  { id: 6, name: "Laptops", icon: <Laptop /> },
  { id: 7, name: "Cameras", icon: <CameraAlt /> },
  { id: 8, name: "Audio", icon: <Headphones /> },
  { id: 9, name: "Gaming", icon: <SportsEsports /> },
  { id: 10, name: "Wearables", icon: <Watch /> },
  { id: 11, name: "Smart Home", icon: <HomeRepairService /> },
  { id: 12, name: "Fitness", icon: <FitnessCenter /> },
  { id: 13, name: "Tools", icon: <Build /> },
  { id: 14, name: "Automotive", icon: <DirectionsCar /> },
  { id: 15, name: "Garden", icon: <LocalFlorist /> },
  { id: 16, name: "Furniture", icon: <Weekend /> },
  { id: 17, name: "Lighting", icon: <Lightbulb /> },
  { id: 18, name: "Storage", icon: <Archive /> },
  { id: 19, name: "Decor", icon: <Brush /> },
  { id: 20, name: "Accessories", icon: <Diamond /> },
];

const Categories: NextPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div>
      <Head>
        <title>Categories - Almar Designs</title>
        <meta name="description" content="Browse product categories" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="categories-container">
        {selectedCategory ? (
          <div className="category-products-view">
            <button className="back-button" onClick={handleBackToCategories}>
              &larr; Back to Categories
            </button>
            <h1 className="categories-heading">{selectedCategory} Products</h1>
            <ProductCard
              selectedCategory={selectedCategory}
              onAddToCart={(product) => {
                console.log('Added product to cart:', product);
              }}
              onRatingChange={(productId, newRating) => {
                console.log(`Rating changed for ${productId}: ${newRating}`);
              }}
            />
          </div>
        ) : (
          <>
            <h1 className="categories-heading">Categories</h1>
            <p className="categories-description">
              Explore our wide range of product categories.
            </p>
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.icon}
                  <h2 className="category-title">{category.name}</h2>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
