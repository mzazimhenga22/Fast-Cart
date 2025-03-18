// components/XiaomiLoader.tsx
import React from 'react';
import './loader.css';

const XiaomiLoader: React.FC = () => {
  return (
    <div className="xiaomi-loader-overlay">
      <div className="xiaomi-loader">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default XiaomiLoader;
