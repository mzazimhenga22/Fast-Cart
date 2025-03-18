// src/pages/subpages/returns-refunds.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';

const ReturnsRefunds: NextPage = () => {
  const router = useRouter();

  const handleGoToDeals = () => {
    router.push('/subpages/deals');
  };

  return (
    <div className="returns-refunds-page">
      <Head>
        <title>Returns & Refunds - Almar Designs</title>
        <meta name="description" content="Manage your returns and refunds" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="returns-refunds-container">
        <h1>Returns & Refunds</h1>
        <p>Coming soon! In the meantime, check our latest deals.</p>
        <button
          onClick={handleGoToDeals}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Check Our Deals
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsRefunds;

