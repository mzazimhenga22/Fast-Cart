// pages/api/analytics.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const firestore = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Fetch users from "users" collection
    const usersSnap = await firestore.collection('users').get();
    const usersData = usersSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        // If createdAt/lastActive are Firestore Timestamps, convert them to ISO strings
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        lastActive: data.lastActive ? data.lastActive.toDate().toISOString() : null,
        country: data.country || '',
        age: data.age || null,
        gender: data.gender || '',
        device: data.device || '',
        browser: data.browser || '',
      };
    });

    // 2. Fetch checkouts from "checkouts" collection
    const checkoutsSnap = await firestore.collection('checkouts').get();
    const checkoutsData = checkoutsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || '',
        // "total" is presumably a number in your screenshot (147000).
        total: data.total || 0,
        // You have a "date" field in your screenshot; parse it if it’s a string.
        // If it's stored like "2023-05-20", JS can parse that with `new Date(...)`.
        date: data.date || null,
        adminMessage: data.adminMessage || '',
        cartItems: Array.isArray(data.cartItems) ? data.cartItems : [],
        // If you ever add fields like category, status, referral, rating, etc., you can handle them here:
        // category: data.category || 'Uncategorized',
        // status: data.status || 'pending',
        // referral: data.referral || '',
        // rating: data.rating || null,
      };
    });

    // Return both sets of data
    return res.status(200).json({
      usersData,
      checkoutsData,
    });
  } catch (error: any) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({ error: error.message });
  }
}
