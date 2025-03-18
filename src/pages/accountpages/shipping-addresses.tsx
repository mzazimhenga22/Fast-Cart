// src/pages/subpages/shipping-addresses.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';

const ShippingAddresses: NextPage = () => {
  return (
    <div className="shipping-addresses-page">
      <Head>
        <title>Shipping Addresses - Almar Designs</title>
        <meta name="description" content="Manage your shipping addresses" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="shipping-addresses-container">
        <h1>Shipping Addresses</h1>
        <p>Manage your default and additional shipping addresses here.</p>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingAddresses;
