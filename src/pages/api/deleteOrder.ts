// src/pages/api/deleteOrder.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    try {
      // Delete the entire document from 'checkouts'
      await db.collection('checkouts').doc(orderId).delete();
      return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting order:', error);
      // Return the error message for debugging
      return res.status(500).json({ error: error.message || 'Error deleting order. Please try again later.' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
