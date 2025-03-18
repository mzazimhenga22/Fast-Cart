import React from 'react';
import { Storefront, PhoneIphone, Tv, LocalLaundryService, HealthAndSafety, Home, Checkroom, Laptop, SportsEsports, ShoppingBasket, BabyChangingStation, MoreHoriz } from '@mui/icons-material'; // Import MUI icons
import './CategorySidebar.css';

interface CategoryItem {
  name: string;
  icon: React.ReactNode; // MUI icons are React components, so we use React.ReactNode type
}

const categories: CategoryItem[] = [
  { name: 'Official Stores', icon: <Storefront /> },
  { name: 'Phones & Tablets', icon: <PhoneIphone /> },
  { name: 'TVs & Audio', icon: <Tv /> },
  { name: 'Appliances', icon: <LocalLaundryService /> },
  { name: 'Health & Beauty', icon: <HealthAndSafety /> },
  { name: 'Home & Office', icon: <Home /> },
  { name: 'Fashion', icon: <Checkroom /> },
  { name: 'Computing', icon: <Laptop /> },
  { name: 'Gaming', icon: <SportsEsports /> },
  { name: 'Supermarket', icon: <ShoppingBasket /> },
  { name: 'Baby Products', icon: <BabyChangingStation /> },
  { name: 'Other categories', icon: <MoreHoriz /> },
];

interface CategorySidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="category-sidebar">
      <ul>
        {categories.map((cat) => (
          <li
            key={cat.name}
            onClick={() => onCategorySelect(cat.name)}
            className={selectedCategory === cat.name ? 'active' : ''}
          >
            {cat.icon} {/* Render the MUI icon here */}
            <span className="category-label">{cat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
