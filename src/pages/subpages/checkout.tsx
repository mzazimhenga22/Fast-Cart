import { NextPage } from 'next';
import Head from 'next/head';
import { useCart } from '../../context/CartContext';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

const Checkout: NextPage = () => {
  const { cartItems } = useCart();
  const router = useRouter();

  // Calculate the total price of the items in the cart
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product.newPrice ?? 0) * item.quantity,
    0
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const paymentMethod = formData.get('payment') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;

    // Map each cart item including the image link along with other properties.
    const orderData = {
      customerName: name,
      address: address,
      paymentMethod: paymentMethod,
      phone: phone,
      email: email,
      totalPrice: totalPrice,
      cartItems: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        image: item.product.image || 'https://via.placeholder.com/100',
        quantity: item.quantity,
        price: item.product.newPrice,
      })),
    };

    try {
      const response = await fetch('/api/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Order successfully submitted!');
        // Redirect to thank-you page including orderId as a query parameter
        router.push(`/subpages/thank-you?orderId=${data.orderId}`);
      } else {
        alert('There was an issue with your order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again later.');
    }
  };

  return (
    <div>
      <Head>
        <title>Checkout - Almar Designs</title>
        <meta name="description" content="Review your order and complete your checkout" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Checkout</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <h3>Order Summary</h3>
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
                    Price: ${(item.product.newPrice ?? 0).toFixed(2)}
                  </p>
                  <p style={{ margin: '0.3rem 0' }}>
                    Total: ${((item.product.newPrice ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <h3>Total: ${totalPrice.toFixed(2)}</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginTop: '2rem' }}>
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                  required
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="address">Shipping Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="123 Street Name, City, Country"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                  required
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1 234 567 8900"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                  required
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                  required
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="payment">Payment Method:</label>
                <select
                  id="payment"
                  name="payment"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                  required
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.8rem 1.5rem',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Complete Checkout
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
