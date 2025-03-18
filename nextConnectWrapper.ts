// src/lib/nextConnectWrapper.ts
import * as nc from 'next-connect';
const nextConnect = (nc as any).default || nc;
export default nextConnect;
