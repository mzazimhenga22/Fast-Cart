import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { trackingInput } = req.query;
  if (!trackingInput || typeof trackingInput !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid tracking input' });
  }
  
  try {
    if (trackingInput.includes('@')) {
      const ordersSnapshot = await db
        .collection('checkouts')
        .where('email', '==', trackingInput)
        .get();
      
      if (ordersSnapshot.empty) {
        return res.status(404).json({ message: 'No orders found for that email.' });
      }
      
      const orders = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          orderId: doc.id,
          status: data.status || 'Pending',
          estimatedDelivery: data.estimatedDelivery || '3 days',
          email: data.email,
          adminMessage: data.adminMessage || '',
          items: data.cartItems || [],
        };
      });
      
      return res.status(200).json({ orders });
    } else {
      const docRef = db.collection('checkouts').doc(trackingInput);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        return res.status(404).json({ message: 'Order not found.' });
      }
      
      const data = docSnap.data();
      const order = {
        orderId: docSnap.id,
        status: data?.status || 'Pending',
        estimatedDelivery: data?.estimatedDelivery || '3 days',
        email: data?.email,
        adminMessage: data?.adminMessage || '',
        items: data?.cartItems || [],
      };
      
      return res.status(200).json({ orders: [order] });
    }
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return res.status(500).json({ message: 'Error tracking order. Please try again later.' });
  }
}
