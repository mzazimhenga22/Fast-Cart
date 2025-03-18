import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { Storefront, Search, Favorite, ShoppingCart, AccountCircle, LocalOffer, HeadsetMic } from '@mui/icons-material';
import './Navbar.css';

const NavbarPublic: React.FC = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Trigger the signup modal after a delay if not logged in
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!user) {
      timer = setTimeout(() => {
        setShowModal(true);
      }, 180000); // 3 minutes
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user]);

  // Toggle dropdown visibility on account container click
  const handleAccountClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowDropdown((prev) => !prev);
  };

  // Dropdown action functions with event propagation stopped
  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push('/login');
  };

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push('/signup');
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/');
  };

  // Navigate to account page
  const handleAccountPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push('/subpages/account');
  };

  // Function to close the dropdown using a dedicated close button
  const handleCloseDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowDropdown(false);
  };

  // Search form handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/SearchPage?q=${searchQuery}`);
    }
  };

  // Modal actions
  const handleModalSignup = () => {
    setShowModal(false);
    router.push('/signup');
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">
            <Link href="/" className="link">
              <Storefront fontSize="large" />
            </Link>
          </div>
          <div className="title">
            <Link href="/" className="link">
              Fast Cart
            </Link>
          </div>
          <div className="search">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="search-button">
                  <Search fontSize="large" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="navbar-right">
          <div className="icon">
            <Link href="/subpages/categories" className="link">
              <Favorite fontSize="large" /> Categories
            </Link>
          </div>
          <div className="icon">
            <Link href="/subpages/wishlist" className="link">
              <Favorite fontSize="large" /> Wishlist
            </Link>
          </div>
          <div className="icon">
            <Link href="/subpages/cart" className="link">
              <ShoppingCart fontSize="large" /> Cart{' '}
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
          {/* Account dropdown container */}
          <div 
            className="icon account-container"
            onClick={handleAccountClick}
          >
            <AccountCircle fontSize="large" /> Account
            <div className={`account-dropdown ${showDropdown ? 'visible' : ''}`}>
              {user ? (
                <>
                  <button onClick={handleAccountPage}>My Account</button>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={handleLogin}>Login</button>
                  <button onClick={handleSignup}>Sign Up</button>
                </>
              )}
              <button onClick={handleCloseDropdown}>Close</button>
            </div>
          </div>
          <div className="icon">
            <Link href="/subpages/deals" className="link">
              <LocalOffer fontSize="large" /> Deals
            </Link>
          </div>
          <div className="icon">
            <Link href="/subpages/support" className="link">
              <HeadsetMic fontSize="large" /> Support
            </Link>
          </div>
        </div>
      </nav>

      {/* Modal for signup prompt */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Join Us!</h2>
            <p>Sign up for an account to enjoy exclusive deals and features.</p>
            <div className="modal-buttons">
              <button onClick={handleModalSignup}>Sign Up</button>
              <button onClick={handleModalClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarPublic;
