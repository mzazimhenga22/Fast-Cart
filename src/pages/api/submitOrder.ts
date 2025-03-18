import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin'; // Import Firestore admin SDK

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const orderData = req.body;

    try {
      // Save the order data in Firestore under the "checkouts" collection
      const docRef = await db.collection('checkouts').add(orderData);
      console.log('Order saved with ID:', docRef.id);

      // Respond with success and include the new order ID
      res.status(200).json({ message: 'Order successfully submitted!', orderId: docRef.id });
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ message: 'Error processing order.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
