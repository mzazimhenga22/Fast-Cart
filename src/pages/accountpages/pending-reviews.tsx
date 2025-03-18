// src/pages/subpages/pending-reviews.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';
import Link from 'next/link'; // for consistent navigation if needed

const PendingReviews: NextPage = () => {
  return (
    <div className="pending-reviews-page">
      <Head>
        <title>Pending Reviews - Almar Designs</title>
        <meta name="description" content="Complete your pending reviews" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="pending-reviews-container">
        <h1>Pending Reviews</h1>
        {/* Add logic to fetch and display pending reviews */}
        <p>This page will list the orders awaiting your review.</p>
      </main>
      <Footer />
    </div>
  );
};

export default PendingReviews;
