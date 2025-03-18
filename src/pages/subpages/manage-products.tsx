// src/pages/admin/ManageProducts.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, ChangeEvent } from 'react';
import NavbarAdmin from '@/components/NavbarAdmin';
import Footer from '@/components/Footer';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../../firebase'; // Adjust the path as needed
import './ManageProducts.css';

interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  category: string;
  specifications?: string; // New field for specifications
}

const ManageProducts: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    image: '',
    title: '',
    description: '',
    oldPrice: 0,
    newPrice: 0,
    category: '',
    specifications: '',
  });

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete a product from Firestore
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Begin editing a product
  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // Save edits to Firestore
  const handleSaveEdit = async () => {
    if (editingProduct) {
      try {
        const productRef = doc(db, 'products', editingProduct.id);
        const { id, ...updatedData } = editingProduct;
        await updateDoc(productRef, updatedData);
        setEditingProduct(null);
        fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  // Add a new product to Firestore
  const handleAddProduct = async () => {
    if (newProduct.title.trim() !== '') {
      try {
        await addDoc(collection(db, 'products'), newProduct);
        setNewProduct({
          image: '',
          title: '',
          description: '',
          oldPrice: 0,
          newPrice: 0,
          category: '',
          specifications: '',
        });
        fetchProducts();
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Debugging: log search query and filtered products
  useEffect(() => {
    console.log('Search Query:', searchQuery);
    console.log('Filtered Products:', filteredProducts);
  }, [searchQuery, filteredProducts]);

  // Group filtered products by category
  const groupedProducts = filteredProducts.reduce((groups: Record<string, Product[]>, product) => {
    const category = product.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  return (
    <div>
      <Head>
        <title>Manage Products - Admin</title>
        <meta name="description" content="Admin panel to manage products" />
      </Head>
      <NavbarAdmin />
      <main className="products-container">
        <h1 className="products-heading">Manage Products</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        {loading && <p>Loading products...</p>}
        
        {editingProduct ? (
          <div className="product-edit-form">
            <h2>Edit Product</h2>
            <input
              type="text"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, title: e.target.value })
              }
              placeholder="Product Title"
            />
            <input
              type="text"
              value={editingProduct.image}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, image: e.target.value })
              }
              placeholder="Product Image URL"
            />
            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
              placeholder="Product Description"
            />
            <textarea
              value={editingProduct.specifications || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  specifications: e.target.value,
                })
              }
              placeholder="Product Specifications (Update details here)"
            />
            <input
              type="number"
              value={editingProduct.oldPrice}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  oldPrice: parseFloat(e.target.value),
                })
              }
              placeholder="Old Price"
            />
            <input
              type="number"
              value={editingProduct.newPrice}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  newPrice: parseFloat(e.target.value),
                })
              }
              placeholder="New Price"
            />
            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, category: e.target.value })
              }
              placeholder="Category"
            />
            <div className="form-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {Object.keys(groupedProducts).length === 0 ? (
              <p>No products found.</p>
            ) : (
              Object.keys(groupedProducts).map((category) => (
                <div key={category} className="category-group">
                  <h2 className="category-heading">{category}</h2>
                  <div className="products-grid">
                    {groupedProducts[category].map((product) => (
                      <div key={product.id} className="product-card">
                        <img
                          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={product.title}
                        />
                        <h2 className="product-title">{product.title}</h2>
                        <p className="product-description">{product.description}</p>
                        {product.specifications && (
                          <p className="product-specs">
                            <strong>Specs:</strong> {product.specifications}
                          </p>
                        )}
                        <p className="product-price">
                          <span className="old-price">${product.oldPrice.toFixed(2)}</span>{' '}
                          <span className="new-price">${product.newPrice.toFixed(2)}</span>
                        </p>
                        <div className="product-actions">
                          <button onClick={() => handleEdit(product)}>Edit</button>
                          <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            <div className="add-product">
              <h2>Add New Product</h2>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, title: e.target.value })
                }
                placeholder="Product Title"
              />
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                placeholder="Product Image URL"
              />
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Product Description"
              />
              <textarea
                value={newProduct.specifications}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, specifications: e.target.value })
                }
                placeholder="Product Specifications"
              />
              <input
                type="number"
                value={newProduct.oldPrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    oldPrice: parseFloat(e.target.value),
                  })
                }
                placeholder="Old Price"
              />
              <input
                type="number"
                value={newProduct.newPrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    newPrice: parseFloat(e.target.value),
                  })
                }
                placeholder="New Price"
              />
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                placeholder="Category"
              />
              <button onClick={handleAddProduct}>Add Product</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageProducts;
