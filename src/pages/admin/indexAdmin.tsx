// src/pages/admin/indexAdmin.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import NavbarAdmin from '../../components/NavbarAdmin';
import SubNavbarAdmin from '../../components/SubNavbarAdmin';
import ProductUpdateForm from '../../components/ProductUpdateForm';
import OrderTracking from '../../components/OrderTracking';

const AdminDashboard: NextPage = () => {
  const [message, setMessage] = useState<string>('');

  const handleUpdate = async (updatedProduct: {
    id?: string;
    image: string;
    title: string;
    description: string;
    oldPrice: number;
    newPrice: number;
    category?: string;
    bannerMessage?: string;
  }) => {
    try {
      const method = updatedProduct.id ? 'PUT' : 'POST';

      // Always create/update the product document.
      const productRes = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!productRes.ok) {
        throw new Error(`Failed to ${method === 'PUT' ? 'update' : 'create'} product`);
      }
      const productData = await productRes.json();
      console.log(`${method === 'PUT' ? 'Updated' : 'Created'} Product:`, productData);

      let bannerData: any = null;
      // If a valid bannerMessage is provided, also create/update the banner document.
      if (updatedProduct.bannerMessage && updatedProduct.bannerMessage.trim() !== "") {
        const bannerRes = await fetch('/api/banners', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        if (!bannerRes.ok) {
          throw new Error(`Failed to ${method === 'PUT' ? 'update' : 'create'} banner`);
        }
        bannerData = await bannerRes.json();
        console.log(`${method === 'PUT' ? 'Updated' : 'Created'} Banner:`, bannerData);
      }

      let categoryData: any = null;
      // If a valid category is provided, also create a category document.
      if (updatedProduct.category && updatedProduct.category.trim() !== "") {
        // Build a payload for the category.
        const categoryPayload = {
          name: updatedProduct.category,
          description: "Category created from product update", // customize as needed
          image: updatedProduct.image, // using the product image as a placeholder
        };

        const categoryRes = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryPayload),
        });
        if (!categoryRes.ok) {
          throw new Error('Failed to create category');
        }
        categoryData = await categoryRes.json();
        console.log(`Created Category:`, categoryData);
      }

      setMessage(
        `Product ${method === 'PUT' ? 'updated' : 'created'} successfully.` +
          (bannerData ? ' Banner created successfully.' : '') +
          (categoryData ? ' Category created successfully.' : '')
      );
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <Head>
        <title>Admin Dashboard - Google IDX</title>
        <meta name="description" content="Admin dashboard for Google IDX" />
      </Head>
      <NavbarAdmin />
      <SubNavbarAdmin />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard of Google IDX.</p>
        <ProductUpdateForm onUpdate={handleUpdate} />
        {message && <p>{message}</p>}
        <OrderTracking />
      </main>
    </div>
  );
};

export default AdminDashboard;
