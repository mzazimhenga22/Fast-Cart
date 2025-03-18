import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, sendSignInLinkToEmail } from 'firebase/auth';
import { app } from '../../../firebase';
import './AdminLogin.css';

interface SecurityQuestions {
  question1: string;
  question2: string;
  question3: string;
  answer1: string;
  answer2: string;
  answer3: string;
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [isNewAdmin, setIsNewAdmin] = useState(false);
  const [userAnswer1, setUserAnswer1] = useState('');
  const [userAnswer2, setUserAnswer2] = useState('');
  const [userAnswer3, setUserAnswer3] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestions | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      const db = getFirestore(app);
      const docRef = doc(db, 'admin security', 'questions');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSecurityQuestions(docSnap.data() as SecurityQuestions);
      }
    };
    fetchQuestions();
  }, []);

  const checkIfAdmin = async (email: string) => {
    const db = getFirestore(app);
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('email', '==', email), where('confirmed', '==', true));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await checkIfAdmin(email);

      if (isAdmin) {
        router.push('/admin/indexAdmin');
      } else {
        setShowQuestions(true);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered as admin');
      } else {
        setError(err.message || 'Failed to login');
      }
      console.error('Login error:', err);
    }
  };

  const checkSecurityAnswers = () => {
    if (!securityQuestions) return false;
    return (
      userAnswer1.toLowerCase() === securityQuestions.answer1.toLowerCase() &&
      userAnswer2.toLowerCase() === securityQuestions.answer2.toLowerCase() &&
      userAnswer3.toLowerCase() === securityQuestions.answer3.toLowerCase()
    );
  };

  const handleAddNewAdmin = async () => {
    if (!newAdminEmail) {
      setError('Please enter an email address');
      return;
    }

    try {
      const db = getFirestore(app);
      const adminsRef = collection(db, 'admins');

      // Check if email already exists
      const adminRef = collection(db, 'admins');
      const q = query(adminRef, where('email', '==', newAdminEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This email is already registered as admin');
        return;
      }

      // Add to admins collection with confirmed: false
      await addDoc(adminsRef, {
        email: newAdminEmail,
        confirmed: false,
        createdAt: serverTimestamp()
      });

      // Send confirmation email
      const auth = getAuth(app);
      const actionCodeSettings = {
        url: `${window.location.origin}/admin/confirm`,
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(auth, newAdminEmail, actionCodeSettings);

      setError('');
      alert('Confirmation email sent to new admin');
      setNewAdminEmail('');
    } catch (err) {
      setError('Failed to add new admin');
    }
  };

  const handleSecurityCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newAdminEmail || newAdminEmail.trim() === '') {
      setError('Please enter an email address');
      return;
    }
    
    try {
      if (checkSecurityAnswers()) {
        const actionCodeSettings = {
          url: window.location.origin + '/admin/confirm',
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(getAuth(app), newAdminEmail.trim(), actionCodeSettings);
        window.localStorage.setItem('adminEmail', newAdminEmail.trim());
        setError('Verification email sent. Please check your inbox.');
      } else {
        setError('Incorrect answers to security questions');
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email link authentication is not enabled. Please contact the system administrator.');
      } else {
        setError(err.message || 'Failed to verify answers');
      }
      console.error('Security check error:', err);
    }
  };

  const verifyAnswers = () => {
    if (!securityQuestions) return false;
    return (
      userAnswer1.toLowerCase() === securityQuestions.answer1.toLowerCase() &&
      userAnswer2.toLowerCase() === securityQuestions.answer2.toLowerCase() &&
      userAnswer3.toLowerCase() === securityQuestions.answer3.toLowerCase()
    );
  };


  return (
    <div className="admin-login-container">
      {!showQuestions ? (
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : !isNewAdmin ? (
        <form onSubmit={handleSecurityCheck} className="security-questions-form">
          <h2>Security Questions</h2>
          {securityQuestions && (
            <>
              <div className="form-group">
                <label>New Admin Email:</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter new admin email"
                  required
                />
              </div>
              <div>
                <p>{securityQuestions.question1}</p>
                <input
                  type="text"
                  value={userAnswer1}
                  onChange={(e) => setUserAnswer1(e.target.value)}
                  required
                />
              </div>
              <div>
                <p>{securityQuestions.question2}</p>
                <input
                  type="text"
                  value={userAnswer2}
                  onChange={(e) => setUserAnswer2(e.target.value)}
                  required
                />
              </div>
              <div>
                <p>{securityQuestions.question3}</p>
                <input
                  type="text"
                  value={userAnswer3}
                  onChange={(e) => setUserAnswer3(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Verify & Add Admin</button>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div className="add-admin-form">
          <h2>Add New Admin</h2>
          <input
            type="email"
            placeholder="New Admin Email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <button onClick={handleAddNewAdmin}>Send Confirmation Email</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AdminLogin;