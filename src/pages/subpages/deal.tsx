import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import Rating from '../../components/Rating';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { ProductData, BannerData, CategoryData, SingleProductCard } from '../../components/ProductCard';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import './Deals.css';
import XiaomiLoader from '@/components/XiaomiLoader';

// DealsPage Component
const DealsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use cart functions from context
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProductData[];
        setProducts(allProducts);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Error fetching products');
      }
    };

    const fetchAllBanners = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'banners'));
        const allBanners = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BannerData[];
        setBanners(allBanners);
      } catch (err: any) {
        console.error('Error fetching banners:', err);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const allCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CategoryData[];
        setCategories(allCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
      }
    };

    setLoading(true);
    Promise.all([fetchAllProducts(), fetchAllBanners(), fetchAllCategories()])
      .finally(() => setLoading(false));
  }, []);

  // Get "Deals of the Day"
  const getDealsOfTheDay = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const discountA =
        a.oldPrice && a.newPrice && a.oldPrice > 0
          ? Math.round(((a.oldPrice - a.newPrice) / a.oldPrice) * 100)
          : 0;
      const discountB =
        b.oldPrice && b.newPrice && b.oldPrice > 0
          ? Math.round(((b.oldPrice - b.newPrice) / b.oldPrice) * 100)
          : 0;
      return discountB - discountA; // descending order
    });
    return sortedProducts.slice(0, 2); // Take top 2 products
  };

  const dealsOfTheDay = getDealsOfTheDay();

  if (loading) return <XiaomiLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="deals-page">
      {/* NavbarPublic and SubNavbar */}
      <NavbarPublic />
      <SubNavbar />

      <div className="deals-of-the-day">
        <h2>Deals of the Day</h2>
        <div className="card-grid">
          {dealsOfTheDay.map((product) => (
            <SingleProductCard
              key={product.id}
              product={product}
              onAddToCart={(product) => addToCart(product)}
              onRatingChange={(newRating) => console.log("New Rating:", newRating)}
            />
          ))}
        </div>
      </div>

      <div className="product-organizer">
        <h2>All Products</h2>
        {categories.map((category) => (
          <div key={category.id} className="category-group">
            <h3>{category.name}</h3>
            <div className="card-grid">
              {products
                .filter((product) => product.category === category.name)
                .map((product) => (
                  <SingleProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(product) => addToCart(product)}
                    onRatingChange={(newRating) => console.log("New Rating:", newRating)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="banners">
        {banners.map((banner) => (
          <div key={banner.id} className="banner">
            <h3>{banner.bannerMessage}</h3>
            <img src={banner.image || 'https://via.placeholder.com/300x150'} alt={banner.bannerMessage} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsPage;
