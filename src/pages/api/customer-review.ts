// pages/api/customer-review.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      try {
        const { productId } = req.query;
        if (!productId) {
          return res.status(400).json({ error: 'ProductId is required' });
        }
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('productId', '==', productId));
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ reviews });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }
    case 'POST': {
      try {
        const { productId, reviewerName, reviewText, rating } = req.body;
        if (!productId || !reviewText || rating === undefined) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const reviewData = {
          productId,
          reviewerName: reviewerName || 'Anonymous',
          reviewText,
          rating: Number(rating),
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'reviews'), reviewData);
        return res.status(201).json({ id: docRef.id, ...reviewData });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  }
}
