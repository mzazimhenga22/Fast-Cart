import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, adminMessage, status } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }
    try {
      const updateData: { adminMessage?: string; status?: string } = {};
      if (adminMessage) updateData.adminMessage = adminMessage;
      if (status) updateData.status = status;
      await db.collection('checkouts').doc(orderId).update(updateData);
      return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error: any) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: error.message || 'Error updating order. Please try again later.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
