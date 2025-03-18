// pages/subpages/cart.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import { useCart } from '../../context/CartContext'; // Import the useCart hook
import Footer from '@/components/Footer';
import { useRouter } from 'next/router'; // Import useRouter for navigation

const Cart: NextPage = () => {
  const { cartItems, removeFromCart } = useCart(); // Access cartItems and removeFromCart from CartContext
  const router = useRouter(); // Initialize router for navigation

  // Calculate the total price of the items in the cart
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product.newPrice ?? 0) * item.quantity,
    0
  );

  // Handle the "Proceed to Checkout" button click
  const handleProceedToCheckout = () => {
    // Navigate to the checkout page
    router.push('/subpages/checkout');
  };

  return (
    <div>
      <Head>
        <title>Cart - Almar Designs</title>
        <meta name="description" content="Review your cart and proceed to checkout" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '4px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={item.product.image || 'https://via.placeholder.com/100'}
                  alt={item.product.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    marginRight: '1rem',
                  }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{item.product.title}</h3>
                  <p style={{ margin: '0.3rem 0' }}>Quantity: {item.quantity}</p>
                  <p style={{ margin: 0 }}>
                    Price: ${(item.product.newPrice ?? 0).toFixed(2)} {/* Default to 0 if undefined */}
                  </p>
                  <p style={{ margin: '0.3rem 0' }}>
                    Total: ${((item.product.newPrice ?? 0) * item.quantity).toFixed(2)} {/* Default to 0 if undefined */}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)} // Trigger remove from cart on click
                    style={{
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '2rem', fontSize: '1.2rem' }}>
              <h3>Total: ${totalPrice.toFixed(2)}</h3>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={handleProceedToCheckout} // Navigate to checkout page on click
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
 