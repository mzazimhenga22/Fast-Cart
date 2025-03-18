import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import './tracking.css'; // Import the unified CSS

// Define the order type that matches your API response
interface Order {
  orderId: string;
  status: string;
  estimatedDelivery: string; // For simulation; could be a date string
  email: string;
  adminMessage: string;
  items: {
    productId: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number; // We assume this is returned or computed
}

const statusStages = [
  'Order Received',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const Tracking: NextPage = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Polling: refresh tracking info every 30 seconds if we already have an order
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderData) {
      interval = setInterval(() => {
        handleTrackOrder(false);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [orderData]);

  const handleTrackOrder = async (resetInput = true) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/order-tracking?trackingInput=${encodeURIComponent(trackingInput)}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        setOrderData(null);
        alert(errorData.message || 'Order not found.');
      } else {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          // When searching by email, if multiple orders are returned, you may choose one or show a list.
          // For simplicity, we take the first order.
          const order = data.orders[0];
          // (Simulated) totalPrice can be computed if not provided:
          order.totalPrice = order.totalPrice || order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          setOrderData(order);
          if (trackingInput.includes('@')) {
            setShowMap(true);
          } else {
            setShowMap(false);
          }
        } else {
          setOrderData(null);
          alert('No orders found.');
        }
      }
    } catch (error: any) {
      alert('Error tracking order: ' + error.message);
    }
    setLoading(false);
    if (resetInput) setTrackingInput('');
  };

  const getCurrentStageIndex = (status: string) => {
    const index = statusStages.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const handleFeedbackSubmit = () => {
    // Here you would send feedback to your backend
    alert('Thank you for your feedback!');
    setFeedbackText('');
    setFeedbackOpen(false);
  };

  return (
    <div>
      <Head>
        <title>Tracking Order - Google IDX</title>
        <meta name="description" content="Track your orders here" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="tracking-main">
        <h1>Tracking Order</h1>
        <p>Monitor your order status and shipping information.</p>

        {/* Tracking Order Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleTrackOrder(); }} className="tracking-form">
          <input
            type="text"
            placeholder="Enter your order ID or email"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>

        {/* Order Data Display */}
        {orderData && (
          <div className="order-info">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <p><strong>Order ID:</strong> {orderData.orderId}</p>
              <p><strong>Status:</strong> {orderData.status}</p>
              <p><strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}</p>
              {orderData.adminMessage && (
                <p><strong>Admin Message:</strong> {orderData.adminMessage}</p>
              )}
              <h3>Items:</h3>
              <ul className="order-items-list">
                {orderData.items.map((item, idx) => (
                  <li key={idx}>
                    <img src={item.image} alt={item.title} />
                    <div>
                      <p>{item.title}</p>
                      <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="order-total"><strong>Total Price:</strong> ${orderData.totalPrice.toFixed(2)}</p>
            </div>

            {/* Order Progress Timeline */}
            <div className="order-timeline">
              {statusStages.map((stage, index) => (
                <div key={index} className={`timeline-step ${index <= getCurrentStageIndex(orderData.status) ? 'completed' : ''}`}>
                  <div className="step-circle">{index + 1}</div>
                  <div className="step-label">{stage}</div>
                </div>
              ))}
            </div>

            {/* Customer Support Section */}
            <div className="support-section">
              <h3>Need Help?</h3>
              <p>Contact our support: <strong>support@alamadesigns.com</strong> or call <strong>+1 800 123 4567</strong></p>
            </div>

            {/* Feedback Prompt (if order is Delivered) */}
            {orderData.status === 'Delivered' && (
              <div className="feedback-section">
                <button onClick={() => setFeedbackOpen(true)}>Leave Feedback</button>
              </div>
            )}
          </div>
        )}

        {/* Google Maps Embed */}
        {showMap && (
          <div className="google-maps-container">
            <iframe
              title="Warehouse Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.9521551453873!2d-122.08560808469287!3d37.42206597982554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7326b17ab03%3A0xb84a7e89b5c21003!2sGoogleplex!5e0!3m2!1sen!2sus!4v1617290641001!5m2!1sen!2sus"
              allowFullScreen={false}
              loading="lazy"
            ></iframe>
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackOpen && (
          <>
            <div className="tracking-overlay" onClick={() => setFeedbackOpen(false)}></div>
            <div className="tracking-popup">
              <h2>Feedback</h2>
              <textarea
                placeholder="Enter your feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              ></textarea>
              <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;
