// src/pages/subpages/saved-items.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';
import { useWishlist } from '../../context/WishlistContext';

const SavedItems: NextPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="saved-items-page">
      <Head>
        <title>Saved Items - Almar Designs</title>
        <meta name="description" content="View your wishlist items" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="saved-items-container" style={{ padding: '2rem' }}>
        <h1>Saved Items</h1>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="wishlist-item"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '1rem',
                  width: '200px',
                  textAlign: 'center',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: 'auto', marginBottom: '0.5rem' }}
                />
                <h3 style={{ fontSize: '1.2rem' }}>{item.title}</h3>
                <p style={{ fontWeight: 'bold' }}>{item.price}</p>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedItems;
