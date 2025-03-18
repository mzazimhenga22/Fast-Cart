// src/pages/subpages/account.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, app } from '../../../firebase';
import Link from 'next/link';
import XiaomiLoader from '../../components/XiaomiLoader';
import { SingleProductCard } from '../../components/ProductCard'; // Ensure this component exists and is exported correctly
import './Account.css';

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  storeCredit?: number;
}

interface ProductData {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  oldPrice?: number;
  newPrice?: number;
  category?: string;
  rating?: number;
  discountPercentage?: number;
}

const Account: NextPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [offlineError, setOfflineError] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [topSellingProducts, setTopSellingProducts] = useState<ProductData[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  // Fetch Firestore user data based on authenticated user
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user && user.email) {
        const fetchUserData = async () => {
          try {
            const docRef = doc(db, 'users', user.email!);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserData(docSnap.data() as UserData);
            } else {
              console.log('No user data found in Firestore.');
            }
          } catch (error: any) {
            console.error('Error fetching user data:', error);
            if (error.code === 'unavailable') {
              setOfflineError(true);
            }
          } finally {
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch products from Firestore and select top selling items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProductData[];
        // Compute discount for each product and sort descending
        const sortedProducts = allProducts.sort((a, b) => {
          const discountA =
            a.oldPrice && a.newPrice && a.oldPrice > 0
              ? (a.oldPrice - a.newPrice) / a.oldPrice
              : 0;
          const discountB =
            b.oldPrice && b.newPrice && b.oldPrice > 0
              ? (b.oldPrice - b.newPrice) / b.oldPrice
              : 0;
          return discountB - discountA;
        });
        // Take top 4 items (adjust the number as needed)
        setTopSellingProducts(sortedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="account-page">
      <Head>
        <title>Account - Almar Designs</title>
        <meta name="description" content="Manage your account details" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="account-container">
        {/* Left Sidebar */}
        <aside className="account-sidebar">
          <h2 className="sidebar-title">My Almar Account</h2>
          <ul className="sidebar-links">
            <li>
              <Link href="/accountpages/orders">Orders</Link>
            </li>
            <li>
              <Link href="/accountpages/pending-reviews">Pending Reviews</Link>
            </li>
            <li>
              <Link href="/accountpages/returns-refunds">Returns &amp; Refunds</Link>
            </li>
            <li>
              <Link href="/accountpages/saved-items">Saved Items</Link>
            </li>
            <li>
              <Link href="/accountpages/account-settings">Account Settings</Link>
            </li>
            <li>
              <Link href="/accountpages/payment-settings">Payment Settings</Link>
            </li>
            <li>
              <Link href="/accountpages/shipping-addresses">Shipping Addresses</Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <section className="account-main">
          <h2 className="section-title">Account Overview</h2>
          {loading ? (
            <p>Loading account details...</p>
          ) : offlineError ? (
            <p>
              Failed to load account details. It appears you are offline. Please check your connection.
            </p>
          ) : (
            <div className="account-overview">
              <div className="overview-box">
                <h3 className="overview-box-title">
                  Welcome, {userData?.name || firebaseUser?.displayName || '[User Name]'}
                </h3>
                <p className="overview-box-subtitle">Account Details</p>
                <ul>
                  <li>
                    Email: {userData?.email || firebaseUser?.email || 'example@email.com'}
                  </li>
                  <li>
                    Phone:{' '}
                    {userData?.phone ? userData.phone : 'Please update phone number'}
                  </li>
                </ul>
              </div>
              <div className="overview-box">
                <h3 className="overview-box-title">Address Book</h3>
                <p className="overview-box-subtitle">Your default shipping address</p>
                <p>{userData?.address || '1234 Example Street, City, Country'}</p>
              </div>
              <div className="overview-box">
                <h3 className="overview-box-title">Payment Method</h3>
                <p className="overview-box-subtitle">
                  {userData?.paymentMethod || 'No payment method added'}
                </p>
                {userData?.paymentMethod && (
                  <p>
                    Your payment method has been updated. Enjoy your store credit bonus!
                  </p>
                )}
              </div>
              <div className="overview-box">
                <h3 className="overview-box-title">Your Store Credit</h3>
                <p className="overview-box-subtitle">
                  ${userData?.storeCredit !== undefined ? userData.storeCredit.toFixed(2) : '0.00'}
                </p>
                <p>Manage your store credit and gift cards.</p>
              </div>
              <div className="overview-box">
                <h3 className="overview-box-title">Newsletter Preferences</h3>
                <p className="overview-box-subtitle">Stay updated on new deals</p>
                <p>Manage your email subscriptions and notifications.</p>
              </div>
            </div>
          )}

          <h2 className="section-title">Top selling items</h2>
          <div className="top-selling-items">
            {productsLoading ? (
              <XiaomiLoader />
            ) : topSellingProducts.length ? (
              topSellingProducts.map((product) => (
                <SingleProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {}}
                  onRatingChange={() => {}}
                />
              ))
            ) : (
              <p>No top selling items found.</p>
            )}
          </div>
        </section>
      </main>
      {/* Admin Login Link */}
      <div className="admin-login-link">
        <p>
          <a href="/admin/login">Admin Login</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
