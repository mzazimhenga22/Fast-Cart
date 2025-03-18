import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { Storefront, Home, Inventory, BarChart, ShoppingCart, AccountCircle } from '@mui/icons-material';
import './Navbar.css';

const NavbarAdmin: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/'); // Redirect after logout
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo as a Home button */}
        <div className="logo">
          <Link href="/">
            <Storefront fontSize="large" />
          </Link>
        </div>
        <div className="title">Fast Cart Admin</div>
        <div className="search">
          <input type="text" placeholder="Search dashboard..." />
        </div>
      </div>
      <div className="navbar-right">
        <div className="icon">
          <Link href="/">
            <Home fontSize="large" /> Home
          </Link>
        </div>
        <div className="icon">
          <Link href="/subpages/manage-products">
            <Inventory fontSize="large" /> Manage Products
          </Link>
        </div>
        <div className="icon">
          <Link href="/subpages/analytics">
            <BarChart fontSize="large" /> Analytics
          </Link>
        </div>
        <div className="icon">
          <Link href="/subpages/checkoutsadmin">
            <ShoppingCart fontSize="large" /> Checkouts
          </Link>
        </div>
        {/* Account dropdown container toggles on click */}
        <div 
          className="icon account-container"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <AccountCircle fontSize="large" /> Account
          <div className={`account-dropdown ${showDropdown ? 'visible' : ''}`}>
            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleSignup}>Sign Up</button>
              </>
            )}
            <button onClick={(e) => { e.stopPropagation(); setShowDropdown(false); }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
