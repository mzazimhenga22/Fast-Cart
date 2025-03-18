import { NextPage, GetServerSideProps } from 'next';
import { db } from '../../../firebaseAdmin'; // Import db but not FieldValue
import Head from 'next/head';
import NavbarAdmin from '../../components/NavbarAdmin';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import './Checkoutsadmin.css';

// --- Types Section ---
interface OrderItem {
  price: number;
  productId: string;
  quantity: number;
  title: string;
  image: string; // New: include the image URL
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
}

interface CheckoutsProps {
  orders: Order[];
}

// --- Main Component Section ---
const Checkouts: NextPage<CheckoutsProps> = ({ orders }) => {

  // DELETE ENTIRE ORDER
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/deleteOrder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),  // Send orderId as body
      });

      if (res.ok) {
        alert('Order deleted successfully!');
        window.location.reload(); // Reload to reflect the updated order list
      } else {
        alert('Error deleting order. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again later.');
    }
  };

  return (
    <div className="checkout-container">
      <Head>
        <title>Checkouts - Almar Designs Admin</title>
        <meta name="description" content="Admin: Manage completed orders and checkouts" />
      </Head>
      <NavbarAdmin />
      <SubNavbar />
      <main>
        <h1 className="checkout-heading">Checkouts</h1>
        {orders.length === 0 ? (
          <p className="empty-cart-message">No completed orders available.</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <h3>Order ID: {order.id}</h3>
                  <p>Status: {order.status}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p>Address: {order.address}</p>
                </div>
                <div className="order-items-list">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem' }}
                          />
                        )}
                        <div>
                          <span>{item.title}</span>
                          <br />
                          <span>{item.quantity} x ${item.price}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-total">
                  <span>Total:</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="order-contact">
                  <p>Email: {order.email}</p>
                  <p>Phone: {order.phone}</p>
                </div>
                
                {/* Delete Entire Order Button */}
                <div className="action-buttons">
                  <button 
                    onClick={() => handleDeleteOrder(order.id)}
                    className="delete-order-btn"
                  >
                    Delete Entire Order
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

// --- Data Fetching Section ---
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const ordersSnapshot = await db.collection('checkouts').get();
    const orders = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();

      // Map each cart item and include the image property
      const items: OrderItem[] = (data.cartItems || []).map((item: any) => ({
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
        title: item.title,
        image: item.image || 'https://via.placeholder.com/100', // default placeholder if image is missing
      }));

      return {
        id: doc.id,
        customerName: data.customerName || 'Unknown',
        totalPrice: data.totalPrice || 0,
        status: data.status || 'Pending',
        items,
        address: data.address || 'No address provided',
        email: data.email || 'Not provided',
        phone: data.phone || 'Not provided',
        paymentMethod: data.paymentMethod || 'Not specified',
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

export default Checkouts;
