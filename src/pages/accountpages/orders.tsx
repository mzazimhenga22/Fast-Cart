// src/pages/accountpages/orders.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../firebase';

interface Order {
  orderId: string;
  status: string;
  estimatedDelivery: string;
  email: string;
  adminMessage: string;
  items: {
    productId: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

const OrdersPage: NextPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Listen for authentication changes to capture the user's email
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Once we have the user's email, call the secure API route to fetch orders
  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/getOrders?trackingInput=${encodeURIComponent(userEmail)}`
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        } else {
          console.error('Error fetching orders:', res.status);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  return (
    <div className="orders-page">
      <Head>
        <title>Orders - Almar Designs</title>
        <meta name="description" content="View your orders" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="orders-container" style={{ padding: '2rem' }}>
        <h1>My Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="order"
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
              }}
            >
              <h3>Order ID: {order.orderId}</h3>
              <p>Status: {order.status}</p>
              <p>Estimated Delivery: {order.estimatedDelivery}</p>
              {order.adminMessage && <p>Message: {order.adminMessage}</p>}
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.title} (x{item.quantity}) - $
                    {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
