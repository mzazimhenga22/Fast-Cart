// pages/admin/Users.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import NavbarAdmin from '@/components/NavbarAdmin';
import Footer from '@/components/Footer';
import './AdminUsers.css';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
}

const Users: NextPage = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listUsers');
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Head>
        <title>Manage Users - Admin</title>
        <meta name="description" content="Admin panel to manage users" />
      </Head>
      <NavbarAdmin />
      <main className="admin-users-container">
        <h1 className="admin-users-heading">Manage Users</h1>
        {loading ? (
          <p className="loading-message">Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>UID</th>
                <th>Email</th>
                <th>Display Name</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.uid}>
                    <td>{index + 1}</td>
                    <td>{user.uid}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.displayName || 'N/A'}</td>
                    <td>{user.phoneNumber || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Users;
