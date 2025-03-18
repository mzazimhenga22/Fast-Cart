// src/components/ProductUpdateForm.tsx
import React, { useState } from "react";
import "./ProductUpdateForm.css";

interface ProductUpdateFormProps {
  initialId?: string;
  initialImage?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialOldPrice?: number;
  initialNewPrice?: number;
  initialCategory?: string;
  initialBannerMessage?: string;
  initialSpecs?: string;
  initialAdditionalImages?: string[];
  initialInvoiceQuantity?: number;
  initialAvailableColors?: string;
  initialWeight?: number;
  initialDimensions?: string;
  initialMaterial?: string;
  initialManufacturer?: string;
  initialWarrantyPeriod?: string;
  initialReleaseDate?: string;
  onUpdate: (updatedProduct: {
    id?: string;
    image: string;
    title: string;
    description: string;
    oldPrice: number;
    newPrice: number;
    category?: string;
    bannerMessage?: string;
    specs?: string;
    additionalImages?: string[];
    invoiceQuantity?: number;
    availableColors?: string;
    weight?: number;
    dimensions?: string;
    material?: string;
    manufacturer?: string;
    warrantyPeriod?: string;
    releaseDate?: string;
  }) => void;
}

const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({
  initialId = "",
  initialImage = "",
  initialTitle = "",
  initialDescription = "",
  initialOldPrice = 0,
  initialNewPrice = 0,
  initialCategory = "",
  initialBannerMessage = "",
  initialSpecs = "",
  initialAdditionalImages = [],
  initialInvoiceQuantity = 0,
  initialAvailableColors = "",
  initialWeight = 0,
  initialDimensions = "",
  initialMaterial = "",
  initialManufacturer = "",
  initialWarrantyPeriod = "",
  initialReleaseDate = "",
  onUpdate,
}) => {
  const [id, setId] = useState(initialId);
  const [image, setImage] = useState(initialImage);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [oldPrice, setOldPrice] = useState(initialOldPrice);
  const [newPrice, setNewPrice] = useState(initialNewPrice);
  const [category, setCategory] = useState(initialCategory);
  const [bannerMessage, setBannerMessage] = useState(initialBannerMessage);
  const [specs, setSpecs] = useState(initialSpecs);
  const [additionalImages, setAdditionalImages] = useState<string[]>(initialAdditionalImages);
  const [newAdditionalImage, setNewAdditionalImage] = useState("");
  const [invoiceQuantity, setInvoiceQuantity] = useState(initialInvoiceQuantity);
  const [availableColors, setAvailableColors] = useState(initialAvailableColors);
  const [weight, setWeight] = useState(initialWeight);
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [material, setMaterial] = useState(initialMaterial);
  const [manufacturer, setManufacturer] = useState(initialManufacturer);
  const [warrantyPeriod, setWarrantyPeriod] = useState(initialWarrantyPeriod);
  const [releaseDate, setReleaseDate] = useState(initialReleaseDate);
  const [uploading, setUploading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      // Replace with your actual file upload endpoint
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to upload image");
      }
      const data = await res.json();
      // Assume the response contains the URL of the uploaded image in data.url
      setImage(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleAddAdditionalImage = () => {
    if (newAdditionalImage.trim()) {
      setAdditionalImages([...additionalImages, newAdditionalImage.trim()]);
      setNewAdditionalImage("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate({
      id: id || undefined,
      image,
      title,
      description,
      oldPrice,
      newPrice,
      category,
      bannerMessage,
      specs,
      additionalImages,
      invoiceQuantity,
      availableColors,
      weight,
      dimensions,
      material,
      manufacturer,
      warrantyPeriod,
      releaseDate,
    });
  };

  // Calculate discount percentage if oldPrice is greater than 0
  const computedDiscount =
    oldPrice > 0 ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

  return (
    <form className="product-update-form" onSubmit={handleSubmit}>
      <h2>Update Product Details</h2>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="id">Product ID (Leave blank to auto-generate)</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter product ID (optional)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUpload">Or Upload an Image</label>
          <input type="file" id="imageUpload" onChange={handleFileChange} />
          {uploading && <p>Uploading...</p>}
        </div>
        <div className="form-group full-width">
          <label htmlFor="title">Product Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product title"
            required
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="description">Product Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="oldPrice">Old Price (Ksh)</label>
          <input
            type="number"
            id="oldPrice"
            value={oldPrice}
            onChange={(e) => setOldPrice(Number(e.target.value))}
            placeholder="Enter old price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPrice">New Price (Ksh)</label>
          <input
            type="number"
            id="newPrice"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            placeholder="Enter new price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bannerMessage">Banner Message</label>
          <input
            type="text"
            id="bannerMessage"
            value={bannerMessage}
            onChange={(e) => setBannerMessage(e.target.value)}
            placeholder="Enter banner message"
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="specs">Product Specifications</label>
          <textarea
            id="specs"
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            placeholder="Enter product specifications"
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="additionalImages">Additional Image Links</label>
          <div className="additional-images">
            <input
              type="text"
              id="additionalImages"
              value={newAdditionalImage}
              onChange={(e) => setNewAdditionalImage(e.target.value)}
              placeholder="Enter additional image URL"
            />
            <button type="button" onClick={handleAddAdditionalImage}>
              Add Image
            </button>
          </div>
          {additionalImages.length > 0 && (
            <ul className="additional-images-list">
              {additionalImages.map((img, index) => (
                <li key={index}>{img}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="invoiceQuantity">Invoice Quantity</label>
          <input
            type="number"
            id="invoiceQuantity"
            value={invoiceQuantity}
            onChange={(e) => setInvoiceQuantity(Number(e.target.value))}
            placeholder="Enter invoice quantity"
          />
        </div>
        <div className="form-group">
          <label htmlFor="availableColors">Available Colors (comma separated)</label>
          <input
            type="text"
            id="availableColors"
            value={availableColors}
            onChange={(e) => setAvailableColors(e.target.value)}
            placeholder="e.g. Red, Blue, Green"
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="Enter weight in kg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dimensions">Dimensions (L x W x H)</label>
          <input
            type="text"
            id="dimensions"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="Enter dimensions"
          />
        </div>
        <div className="form-group">
          <label htmlFor="material">Material</label>
          <input
            type="text"
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Enter material"
          />
        </div>
        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer</label>
          <input
            type="text"
            id="manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="Enter manufacturer"
          />
        </div>
        <div className="form-group">
          <label htmlFor="warrantyPeriod">Warranty Period</label>
          <input
            type="text"
            id="warrantyPeriod"
            value={warrantyPeriod}
            onChange={(e) => setWarrantyPeriod(e.target.value)}
            placeholder="Enter warranty period"
          />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Release Date</label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
      </div>
      <div className="discount-info">
        <p>
          Discount: <strong>{computedDiscount}%</strong>
        </p>
      </div>
      <button type="submit">Update Product</button>
    </form>
  );
};

export default ProductUpdateForm;
