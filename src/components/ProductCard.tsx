// src/components/ProductCard.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Rating from './Rating'; // Assuming this component exists and works for displaying ratings
import { useRouter } from 'next/router';
import XiaomiLoader from '../components/XiaomiLoader'; // Import your CSS-based loader component
import './ProductCard.css';

// 1) Shared Types
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
  cartAmount?: number; // Now included
}

export interface BannerData {
  id: string;
  bannerMessage: string;
  image?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

// 2) SingleProductCard: Renders an individual product
interface SingleProductCardProps {
  product: ProductData; // product is passed as a prop here
  onAddToCart: (product: ProductData) => void;
  onRatingChange?: (newRating: number) => void;
}

const SingleProductCard: React.FC<SingleProductCardProps> = ({
  product,
  onAddToCart,
  onRatingChange,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push({
      pathname: '/product/[id]',
      query: {
        id: product.id,
        title: product.title,
        image: product.image,
        description: product.description,
        oldPrice: product.oldPrice,
        newPrice: product.newPrice,
        category: product.category,
        rating: product.rating,
        discountPercentage: product.discountPercentage,
        specs: product.specs,
        additionalImages: product.additionalImages ? JSON.stringify(product.additionalImages) : undefined,
        invoiceQuantity: product.invoiceQuantity,
        availableColors: product.availableColors,
        weight: product.weight,
        dimensions: product.dimensions,
        material: product.material,
        manufacturer: product.manufacturer,
        warrantyPeriod: product.warrantyPeriod,
        releaseDate: product.releaseDate,
      },
    });
  };

  const {
    image,
    title,
    description,
    oldPrice = 0,
    newPrice = 0,
    rating = 0,
    discountPercentage,
  } = product;

  const computedDiscount =
    discountPercentage ?? Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-image">
        <img
          src={image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={title}
        />
        {computedDiscount > 0 && (
          <span className="product-card-discount-overlay">
            -{computedDiscount}%
          </span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{title}</h3>
        <div onClick={(e) => e.stopPropagation()}>
          <Rating
            initialRating={rating}
            interactive={true}
            onRatingChange={onRatingChange}
          />
        </div>
        <p className="product-card-description">{description}</p>
        <div className="product-card-pricing">
          <span className="product-card-new-price">ksh{newPrice.toFixed(2)}</span>
          {oldPrice > 0 && (
            <span className="product-card-old-price">
              ksh{oldPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          className="add-to-cart-button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// 3) Banner Component
interface BannerProps {
  bannerMessage: string;
  image?: string;
}

const Banner: React.FC<BannerProps> = ({ bannerMessage, image }) => {
  return (
    <div className="banner">
      {image && (
        <div className="banner-image-container">
          <img src={image} alt={bannerMessage} className="banner-image" />
        </div>
      )}
      <h2 className="banner-message">{bannerMessage}</h2>
      <p>Get the best deals now!</p>
    </div>
  );
};

// 4) ProductOrganizer: Groups products by categories from Firestore
interface ProductOrganizerProps {
  products: ProductData[];
  banners: BannerData[];
  categories: CategoryData[];
  onAddToCart: (product: ProductData) => void;
  onRatingChange?: (productId: string, newRating: number) => void;
}

const ProductOrganizer: React.FC<ProductOrganizerProps> = ({
  products,
  banners,
  categories,
  onAddToCart,
  onRatingChange,
}) => {
  return (
    <div className="organizer-container">
      {categories.map((cat, index) => {
        // Filter products that belong to the current category
        const catProducts = products.filter(
          (prod) => prod.category === cat.name
        );
        return (
          <React.Fragment key={cat.id}>
            <div className="category-group">
              <h2>{cat.name}</h2>
              <div className="card-grid">
                {catProducts.map((product) => (
                  <SingleProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onRatingChange={(newRating) =>
                      onRatingChange?.(product.id, newRating)
                    }
                  />
                ))}
              </div>
            </div>
            {index < categories.length - 1 && banners.length > 0 && (
              <Banner
                bannerMessage={banners[index % banners.length].bannerMessage}
                image={banners[index % banners.length].image}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// 5) ProductCard: Fetches products, banners, and categories from Firestore,
// and applies category filtering based on the selectedCategory prop.
interface ProductCardProps {
  onAddToCart: (product: ProductData) => void;
  onRatingChange?: (productId: string, newRating: number) => void;
  selectedCategory?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  onAddToCart,
  onRatingChange,
  selectedCategory,
}) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    Promise.all([
      fetchAllProducts(),
      fetchAllBanners(),
      fetchAllCategories(),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <XiaomiLoader />;
  if (error) return <div>Error: {error}</div>;

  // Function to get "Deals of the Day"
  const getDealsOfTheDay = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const discountA = Math.round(((a.oldPrice ?? 0) - (a.newPrice ?? 0)) / (a.oldPrice ?? 1) * 100);
      const discountB = Math.round(((b.oldPrice ?? 0) - (b.newPrice ?? 0)) / (b.oldPrice ?? 1) * 100);
      return discountB - discountA;
    });
    return sortedProducts.slice(0, 2);
  };

  const dealsOfTheDay = getDealsOfTheDay();
  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.name === selectedCategory)
    : categories;

  return (
    <div>
      <div className="deals-of-the-day">
        <h2>Deals of the Day</h2>
        <div className="card-grid">
          {dealsOfTheDay.map((product) => (
            <SingleProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onRatingChange={(newRating) =>
                onRatingChange?.(product.id, newRating)
              }
            />
          ))}
        </div>
      </div>

      <ProductOrganizer
        products={products}
        banners={banners}
        categories={filteredCategories}
        onAddToCart={onAddToCart}
        onRatingChange={onRatingChange}
      />
    </div>
  );
};

export default ProductCard;
export { SingleProductCard };
