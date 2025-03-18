// src/pages/subpages/payment-settings.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';

const PaymentSettings: NextPage = () => {
  return (
    <div className="payment-settings-page">
      <Head>
        <title>Payment Settings - Almar Designs</title>
        <meta name="description" content="Manage your payment settings" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="payment-settings-container">
        <h1>Payment Settings</h1>
        <p>Configure your payment methods, billing addresses, and review transaction history here.</p>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSettings;
