// src/components/Footer.tsx

import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="global-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h3>Need Help?</h3>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Returns & Refunds</li>
            <li>Order Tracking</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>About Almar</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press & Media</li>
            <li>Investor Relations</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Make Money with Us</h3>
          <ul>
            <li>Sell on Almar</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
            <li>Self-Publish</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Payment Methods</h3>
          <ul>
            <li>Credit/Debit Cards</li>
            <li>PayPal</li>
            <li>Mobile Money</li>
            <li>Cash on Delivery</li>
          </ul>
        </div>
      </div>
      <p className="footer-bottom">
        &copy; 2025 Almar Designs. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
