import React from 'react';
import './SubNavbar.css';

const SubNavbarAdmin: React.FC = () => {
  return (
    <div className="subnavbar">
      <ul className="subnavbar-menu">
        <li><a href="/admin/indexAdmin">Dashboard</a></li>
        <li><a href="/admin/manage-products">Manage Products</a></li>
        <li><a href="/admin/orders">Orders</a></li>
        <li><a href="/admin/users">Users</a></li>
        <li><a href="/admin/blog">Blog</a></li>
      </ul>
    </div>
  );
};

export default SubNavbarAdmin;
