import { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import './ThankYou.css';

const ThankYou: NextPage = () => {
  const router = useRouter();
  const { orderId } = router.query;  // orderId should now be passed as a query parameter
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger the pop-up animation on mount
    setAnimate(true);
  }, []);

  return (
    <div>
      <Head>
        <title>Thank You - Almar Designs</title>
        <meta name="description" content="Your order is being reviewed and will be updated as soon as possible." />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="main">
        <div className={`popup ${animate ? 'show' : ''}`}>
          <div className="flowerContainer">
            <img src="/images/flower1.png" alt="Flower" className="flower" />
            <img src="/images/flower2.png" alt="Flower" className="flower" />
            <img src="/images/flower3.png" alt="Flower" className="flower" />
          </div>
          <h1>Thank You!</h1>
          <p>Your order is being reviewed and will be updated as soon as possible.</p>
          {orderId && <p>Your Order ID: <strong>{orderId}</strong></p>}
          <button onClick={() => router.push('/')}>Return Home</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
