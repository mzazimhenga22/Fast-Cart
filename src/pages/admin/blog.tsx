import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NavbarAdmin from '../../components/NavbarAdmin';
import SubNavbarAdmin from '../../components/SubNavbarAdmin';
import './AdminBlog.css';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  publishedDate: string;
}

const LOCAL_STORAGE_KEY = 'blogPosts';

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPublishedDate, setFormPublishedDate] = useState('');

  // Load blog posts from local storage on mount
  useEffect(() => {
    const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  // Persist posts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  // Clear the form fields
  const clearForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormImage('');
    setFormPublishedDate('');
    setEditingPost(null);
  };

  // Handle form submission for adding/updating a post
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formTitle.trim() === '' || formContent.trim() === '' || formPublishedDate.trim() === '')
      return;

    if (editingPost) {
      // Update an existing post
      const updatedPosts = posts.map((post) =>
        post.id === editingPost.id
          ? {
              ...post,
              title: formTitle,
              content: formContent,
              image: formImage,
              publishedDate: formPublishedDate,
            }
          : post
      );
      setPosts(updatedPosts);
    } else {
      // Add a new post
      const newPost: BlogPost = {
        id: Date.now(),
        title: formTitle,
        content: formContent,
        image: formImage ? formImage : undefined,
        publishedDate: formPublishedDate,
      };
      setPosts([...posts, newPost]);
    }
    clearForm();
  };

  // Populate form with post data for editing
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormContent(post.content);
    setFormImage(post.image || '');
    setFormPublishedDate(post.publishedDate);
  };

  // Delete a post
  const handleDelete = (postId: number) => {
    const filteredPosts = posts.filter((post) => post.id !== postId);
    setPosts(filteredPosts);
  };

  return (
    <div className="admin-blog-container">
      <Head>
        <title>Admin Blog Management</title>
        <meta name="description" content="Admin panel for managing blog posts" />
      </Head>

      {/* Top Admin Navbar */}
      <NavbarAdmin />

      {/* Subnavbar directly below the main navbar */}
      <SubNavbarAdmin />

      {/* Main Content Area */}
      <div className="admin-blog-content">
        <h1 className="page-title">Admin Blog Management</h1>

        <section className="admin-form-section">
          <h2>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
          <form onSubmit={handleSubmit} className="admin-blog-form">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                id="title"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Image URL:</label>
              <input
                id="image"
                type="text"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="publishedDate">Published Date:</label>
              <input
                id="publishedDate"
                type="text"
                value={formPublishedDate}
                onChange={(e) => setFormPublishedDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                required
              />
            </div>
            <div className="button-group">
              <button type="submit">{editingPost ? 'Update Post' : 'Add Post'}</button>
              {editingPost && (
                <button type="button" onClick={clearForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-posts-section">
          <h2>Existing Posts</h2>
          {posts.length > 0 ? (
            <ul className="admin-posts-list">
              {posts.map((post) => (
                <li key={post.id}>
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 100)}...</p>
                  <p>
                    <strong>Published:</strong> {post.publishedDate}
                  </p>
                  <div className="admin-post-actions">
                    <button onClick={() => handleEdit(post)}>Edit</button>
                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminBlog;
