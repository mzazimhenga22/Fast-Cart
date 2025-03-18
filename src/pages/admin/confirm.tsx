
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../../../firebase';

const AdminConfirm = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const confirmAdmin = async () => {
      const auth = getAuth(app);
      const db = getFirestore(app);

      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('adminEmail');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        try {
          await signInWithEmailLink(auth, email!, window.location.href);
          
          // Add admin to Firestore
          await setDoc(doc(db, 'admins', email!), {
            email: email,
            confirmed: true,
            createdAt: new Date()
          });

          window.localStorage.removeItem('adminEmail');
          router.push('/admin/indexAdmin');
        } catch (err: any) {
          setError('Failed to confirm admin status');
          console.error(err);
        }
      }
    };

    confirmAdmin();
  }, [router]);

  return (
    <div className="admin-confirm-container">
      <h1>Confirming Admin Status</h1>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AdminConfirm;
