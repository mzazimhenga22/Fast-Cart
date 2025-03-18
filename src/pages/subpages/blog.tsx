import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import './Blog.css';
import Footer from '../../components/Footer';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  publishedDate: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

const LOCAL_STORAGE_KEY = 'blogPosts';

const Blog: NextPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  // Load blog posts from local storage on mount
  useEffect(() => {
    const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || !activePost) return;
    const comment: Comment = {
      id: Date.now(),
      author: 'Anonymous', // Replace with user info if available
      content: newComment,
      date: new Date().toLocaleString(),
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div>
      <Head>
        <title>Blog - Google IDX</title>
        <meta
          name="description"
          content="Read our latest articles on new products, news updates and more."
        />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="blog-container">
        <h1 className="blog-heading">Blog</h1>

        {/* Blog List View */}
        {!activePost ? (
          <div className="blog-list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="blog-post-card">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-post-image"
                    />
                  )}
                  <div className="blog-post-info">
                    <h2>{post.title}</h2>
                    <p>{post.content.substring(0, 150)}...</p>
                    <p className="blog-post-date">
                      Published on: {post.publishedDate}
                    </p>
                    <button
                      onClick={() => {
                        setActivePost(post);
                        // Optionally, fetch comments for this post here
                        setComments([]);
                      }}
                      className="read-more-button"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-posts-message">
                No posts available. Check back later!
              </p>
            )}
          </div>
        ) : (
          /* Blog Detail View */
          <div className="blog-detail">
            <button onClick={() => setActivePost(null)} className="back-button">
              &larr; Back to Blog List
            </button>
            <h2>{activePost.title}</h2>
            <p className="blog-post-date">
              Published on: {activePost.publishedDate}
            </p>
            {activePost.image && (
              <img
                src={activePost.image}
                alt={activePost.title}
                className="blog-detail-image"
              />
            )}
            <div className="blog-content">{activePost.content}</div>

            {/* Comments Section */}
            <section className="comments-section">
              <h3>Comments</h3>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p className="comment-author">
                      {comment.author}{' '}
                      <span className="comment-date">{comment.date}</span>
                    </p>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet. Be the first to comment!</p>
              )}
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                  className="comment-textarea"
                  rows={3}
                />
                <button type="submit" className="comment-submit-button">
                  Submit Comment
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
