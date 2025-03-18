// src/pages/accountpages/account-settings.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '../../components/Footer';
import {
  getAuth,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { doc, updateDoc,setDoc } from 'firebase/firestore';
import { app, db } from '../../../firebase';

const AccountSettings: NextPage = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    try {
      await updateEmail(user, newEmail);
      setMessage('Email updated successfully!');
      setError(null);
      setNewEmail('');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        try {
          await sendEmailVerification(user);
          setError(
            'A verification email has been sent. Please verify your new email and try again.'
          );
        } catch (verificationErr: any) {
          setError(verificationErr.message);
        }
      } else {
        setError(err.message);
      }
      setMessage(null);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setMessage(null);
      return;
    }
    if (!currentPassword) {
      setError('Please enter your current password.');
      setMessage(null);
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage('Password updated successfully!');
      setError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
      setMessage(null);
    }
  };

  // Function to send SMS verification code using RecaptchaVerifier
  const handleSendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    try {
      // Initialize RecaptchaVerifier
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible' }
      );
      const result = await signInWithPhoneNumber(auth, newPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setMessage('Verification code sent to your phone.');
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMessage(null);
    }
  };

  // Function to verify the SMS code and update phone number in Firestore
  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError('Please request a verification code first.');
      return;
    }
    try {
      await confirmationResult.confirm(verificationCode);
      const email = user?.email;
      if (!email) {
        setError('User email not found.');
        return;
      }
      const userDocRef = doc(db, 'users', email);
await setDoc(userDocRef, { phone: newPhone }, { merge: true });
      setMessage('Phone number verified and updated successfully!');
      setError(null);
      setConfirmationResult(null);
      setNewPhone('');
      setVerificationCode('');
    } catch (err: any) {
      setError(err.message);
      setMessage(null);
    }
  };

  // Function to update address and payment method in Firestore
  const handleAddressPaymentUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    // Validate that the address is Kenyan (case-insensitive check)
    if (!newAddress.toLowerCase().includes('kenya')) {
      setError('Address must be in Kenya.');
      return;
    }
    if (!newPaymentMethod) {
      setError('Please enter a payment method.');
      return;
    }
    try {
      const email = user.email;
      if (!email) {
        setError('User email not found.');
        return;
      }
      const userDocRef = doc(db, 'users', email);
      // Using setDoc with merge ensures the document is created if it doesn't exist
      await setDoc(userDocRef, { address: newAddress, paymentMethod: newPaymentMethod }, { merge: true });
      setMessage('Address and Payment Method updated successfully!');
      setError(null);
      setNewAddress('');
      setNewPaymentMethod('');
    } catch (err: any) {
      setError(err.message);
      setMessage(null);
    }
  };

  return (
    <div className="account-settings-page">
      <Head>
        <title>Account Settings - Almar Designs</title>
        <meta name="description" content="Manage your account settings" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="account-settings-container" style={{ padding: '2rem' }}>
        <h1>Account Settings</h1>
        <p>Update your personal details, change your password, and configure your account preferences here.</p>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Update Email Section */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Update Email</h2>
          <form onSubmit={handleEmailUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <label>
              New Email:
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <button
              type="submit"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Update Email
            </button>
          </form>
        </section>

        {/* Update Password Section */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Update Password</h2>
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <label>
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <button
              type="submit"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Update Password
            </button>
          </form>
        </section>

        {/* Update Phone Number Section */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Update Phone Number</h2>
          {/* Form to send SMS verification code */}
          {!confirmationResult && (
            <form onSubmit={handleSendVerification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <label>
                New Phone Number:
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
                />
              </label>
              <button
                type="submit"
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Send Verification Code
              </button>
            </form>
          )}

          {/* Form to verify the SMS code */}
          {confirmationResult && (
            <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', marginTop: '1rem' }}>
              <label>
                Enter Verification Code:
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
                />
              </label>
              <button
                type="submit"
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Verify Code &amp; Update Phone
              </button>
            </form>
          )}

          {/* reCAPTCHA container */}
          <div id="recaptcha-container" />
        </section>

        {/* Update Address & Payment Method Section */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Update Address &amp; Payment Method</h2>
          <form onSubmit={handleAddressPaymentUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <label>
              New Address (Must be in Kenya):
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <label>
              Payment Method:
              <input
                type="text"
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <button
              type="submit"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Update Address &amp; Payment Method
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSettings;
