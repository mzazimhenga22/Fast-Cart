// src/components/OrderTracking.tsx
import React, { useState } from 'react';

interface Order {
  orderId: string;
  status: string;
  estimatedDelivery: string;
}

interface OrderData {
  orders: Order[];
  message?: string;
}

const OrderTracking: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setLoading(true);
    setMessage('');
    try {
      // Replace '/api/order-tracking' with the actual API route if different
      const res = await fetch(
        `/api/order-tracking?trackingInput=${encodeURIComponent(trackingInput)}`
      );
      if (!res.ok) {
        const errorData: { message: string } = await res.json(); //Added type definition
        throw new Error(errorData.message || 'Error tracking order');
      }
      const data: OrderData = await res.json(); //Added type definition
      setOrders(data.orders);
      if (data.orders.length === 0) {
        setMessage('No orders found.');
      }
    } catch (error: any) {
      setOrders([]);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Order Tracking</h2>
      <form onSubmit={handleTrackOrder}>
        <input
          type="text"
          placeholder="Enter order ID or email"
          value={trackingInput}
          onChange={(e) => setTrackingInput(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: '1rem' }}>
          Track Order
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      {orders.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Orders</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.orderId}>
                <p>
                  <strong>Order ID:</strong> {order.orderId}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;