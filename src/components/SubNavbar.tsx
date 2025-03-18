import React from 'react';
import './SubNavbar.css';

const SubNavbar: React.FC = () => {
  return (
    <div className="subnavbar">
      <ul className="subnavbar-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/subpages/shop">Shop</a></li>
        <li><a href="/subpages/tracking">Tracking Order</a></li>
        <li><a href="/subpages/blog">Blog</a></li>
      </ul>
    </div>
  );
};

export default SubNavbar;
