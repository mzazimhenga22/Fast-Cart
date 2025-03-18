// pages/api/products/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin'; // Adjust path to your firebaseAdmin init

interface Product {
  title: string;
  image: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  category?: string;
  rating?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch a single product by id from the query string.
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid product id' });
      }
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ id: doc.id, ...doc.data() });
    } else if (req.method === 'POST') {
      // Create a new product
      const newProduct: Product = req.body;
      const docRef = await db.collection('products').add(newProduct);
      return res.status(201).json({ id: docRef.id, ...newProduct });
    } else if (req.method === 'PUT') {
      // Update an existing product or create if product id is not provided
      const { id, ...data } = req.body;
      if (!id) {
        // No product id provided: create a new product (auto-generate id)
        const docRef = await db.collection('products').add(data);
        return res.status(201).json({ id: docRef.id, ...data });
      } else {
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
          // If product with provided id doesn't exist, create it
          await docRef.set(data);
          return res.status(201).json({ id, ...data });
        } else {
          // Update existing product
          await docRef.update(data);
          return res.status(200).json({ id, ...data });
        }
      }
    } else if (req.method === 'DELETE') {
      // Delete a product by id provided as a query parameter
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid product id' });
      }
      await db.collection('products').doc(id).delete();
      return res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} not allowed`);
    }
  } catch (error) {
    console.error('Error in products API:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
