// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import XiaomiLoader from '../components/XiaomiLoader';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <WishlistProvider>
          {loading && <XiaomiLoader />}
          <Component {...pageProps} />
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}

export default MyApp;
