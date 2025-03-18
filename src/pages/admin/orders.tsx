import { NextPage, GetServerSideProps } from 'next';
import { db } from '../../../firebaseAdmin';
import Head from 'next/head';
import NavbarAdmin from '../../components/NavbarAdmin';
import SubNavbar from '../../components/SubNavbarAdmin';
import Footer from '@/components/Footer';
import { useState, ChangeEvent } from 'react';
import './OrdersAdmin.css'; // Your CSS for admin orders page

// --- Types Section ---
interface OrderItem {
  price: number;
  productId: string;
  quantity: number;
  title: string;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
  address: string;
  email: string;
  phone: string;
  paymentMethod: string;
  adminMessage?: string;
}

interface OrdersProps {
  orders: Order[];
}

// --- Admin Orders Page ---
const Orders: NextPage<OrdersProps> = ({ orders }) => {
  // Local state for admin message updates (per order)
  const [updates, setUpdates] = useState<{ [key: string]: string }>({});
  // Local state for status updates (per order)
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});

  const handleInputChange = (orderId: string, e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdates({
      ...updates,
      [orderId]: e.target.value,
    });
  };

  const handleStatusChange = (orderId: string, e: ChangeEvent<HTMLSelectElement>) => {
    setStatusUpdates({
      ...statusUpdates,
      [orderId]: e.target.value,
    });
  };

  // Function to update admin message (and optionally status) via API route
  const handleUpdateOrder = async (orderId: string) => {
    const adminMessage = updates[orderId];
    const newStatus = statusUpdates[orderId];
    if (!adminMessage && !newStatus) {
      alert('Please enter a message or select a new status before updating.');
      return;
    }
    try {
      const res = await fetch('/api/updateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, adminMessage, status: newStatus }),
      });
      if (res.ok) {
        alert('Order updated successfully!');
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || 'Error updating order.');
      }
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again later.');
    }
  };

  return (
    <div className="orders-container">
      <Head>
        <title>Orders - Admin Panel</title>
        <meta name="description" content="Manage and update orders" />
      </Head>
      <NavbarAdmin />
      <SubNavbar />
      <main>
        <h1>Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-details">
                <h3>Order ID: {order.id}</h3>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '0.5rem' }}
                          />
                        )}
                        <span>{item.title} - {item.quantity} x ${item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                {order.adminMessage && (
                  <p><strong>Admin Message:</strong> {order.adminMessage}</p>
                )}
              </div>
              <div className="order-update">
                <textarea
                  placeholder="Enter update message (e.g., 'Your order is confirmed, we will reach out soon')"
                  value={updates[order.id] || ''}
                  onChange={(e) => handleInputChange(order.id, e)}
                  rows={3}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                ></textarea>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <select
                    value={statusUpdates[order.id] || order.status}
                    onChange={(e) => handleStatusChange(order.id, e)}
                    style={{ padding: '0.5rem', fontSize: '1rem' }}
                  >
                    <option value="Order Received">Order Received</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button onClick={() => handleUpdateOrder(order.id)}>
                    Update Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

// --- Data Fetching Section ---
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const ordersSnapshot = await db.collection('checkouts').get();
    const orders = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.customerName || 'Unknown',
        totalPrice: data.totalPrice || 0,
        status: data.status || 'Pending',
        items: data.cartItems || [],
        address: data.address || 'No address provided',
        email: data.email || 'Not provided',
        phone: data.phone || 'Not provided',
        paymentMethod: data.paymentMethod || 'Not specified',
        adminMessage: data.adminMessage || '', // admin update message if any
      };
    });

    return {
      props: {
        orders,
      },
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      props: {
        orders: [],
      },
    };
  }
};

export default Orders;
