// pages/api/categories.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin'; // Adjust path as needed

interface Category {
  name: string;
  description?: string;
  image?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Fetch all categories from the "categories" collection
      const snapshot = await db.collection('categories').get();
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.status(200).json(categories);
    } else if (req.method === 'POST') {
      // Create a new category document
      const { name, description, image } = req.body as Category;
      if (!name || name.trim() === "") {
        return res.status(400).json({ message: 'Category name is required' });
      }
      const docRef = await db.collection('categories').add({
        name,
        description: description || "",
        image: image || ""
      });
      return res.status(201).json({ id: docRef.id, name, description, image });
    } else if (req.method === 'PUT') {
      // Update an existing category document (id required)
      const { id, name, description, image } = req.body as Category & { id?: string };
      if (!id) {
        return res.status(400).json({ message: 'Category id is required for update' });
      }
      const categoryRef = db.collection('categories').doc(id);
      const doc = await categoryRef.get();
      if (!doc.exists) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await categoryRef.update({
        name,
        description,
        image
      });
      return res.status(200).json({ id, name, description, image });
    } else if (req.method === 'DELETE') {
      // Delete a category document (expects id in the query string)
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid category id' });
      }
      await db.collection('categories').doc(id).delete();
      return res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error in categories API:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
