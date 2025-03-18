import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import { useWishlist } from '../../context/WishlistContext';
import './Wishlist.css';
import Image from 'next/image';

const Wishlist: NextPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  const moveToCart = (id: string) => {
    // Here you can integrate your cart logic.
    alert(`Item ${id} moved to cart!`);
    removeFromWishlist(id);
  };

  return (
    <div>
      <Head>
        <title>Wishlist - Almar Designs</title>
        <meta name="description" content="View your wishlist items" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="wishlist-container">
        <h1 className="wishlist-heading">Your Wishlist</h1>
        <p className="wishlist-description">
          Keep track of your favorite items and move them to the cart anytime.
        </p>
        {wishlist.length === 0 ? (
          <p className="wishlist-empty">Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  priority={true}
                />
                <h2 className="wishlist-title">{item.title}</h2>
                <p className="wishlist-price">{item.price}</p>
                <div className="wishlist-actions">
                  <button onClick={() => moveToCart(item.id)} className="wishlist-button move-to-cart">
                    Add to Cart
                  </button>
                  <button onClick={() => removeFromWishlist(item.id)} className="wishlist-button remove-item">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;