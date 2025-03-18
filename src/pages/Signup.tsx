
import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { app } from '../../firebase';
import './SignupPage.css';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: ''
  });
  const router = useRouter();
  const auth = getAuth(app);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, email, password } = formData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      router.push('/login');
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Error during Google signup:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="button">Sign Up</button>
        </form>
        <div className="additional-links">
          <Link href="/login">Already have an account? Login</Link>
        </div>
        <div className="divider">or</div>
        <button onClick={handleGoogleSignup} className="social-button">
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
