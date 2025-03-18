// pages/api/banners.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin'; // Adjust path if needed

interface Banner {
  image: string;
  bannerMessage: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST' || req.method === 'PUT') {
      const { id, image, bannerMessage } = req.body;
      if (!bannerMessage || bannerMessage.trim() === "") {
        return res.status(400).json({ message: 'Missing bannerMessage' });
      }
      let docRef;
      if (req.method === 'POST') {
        // Create a new banner document
        docRef = await db.collection('banners').add({ image, bannerMessage });
        return res
          .status(201)
          .json({ id: docRef.id, image, bannerMessage });
      } else {
        // PUT: update an existing banner (id must be provided)
        if (!id) {
          return res.status(400).json({ message: 'Missing id for banner update' });
        }
        docRef = db.collection('banners').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
          // If banner doesn't exist, create it
          await docRef.set({ image, bannerMessage });
          return res.status(201).json({ id, image, bannerMessage });
        } else {
          // Otherwise, update the banner
          await docRef.update({ image, bannerMessage });
          return res.status(200).json({ id, image, bannerMessage });
        }
      }
    } else {
      res.setHeader('Allow', ['POST', 'PUT']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error creating/updating banner:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
