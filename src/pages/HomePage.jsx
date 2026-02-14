import React, { useState } from "react";
import Category from "../components/Category";
import Products from "../components/Products";
import SlideShow from "../components/SlideShow";
import ProductBrand from "../components/ProductBrand"; // The component that shows filtered results

const HomePage = () => {
  const [activeBrand, setActiveBrand] = useState(null);

  // This function will be triggered when a brand is clicked in the Category marquee
  const handleSelectBrand = (brandName) => {
    setActiveBrand(brandName);
    // Smooth scroll to results
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section (Only show if no brand is selected or keep it always) */}
      {!activeBrand && <SlideShow />}

      {/* 2. Brand Marquee - we pass the setter function as a prop */}
      <Category onSelectBrand={handleSelectBrand} />

      {/* 3. Main Content Area */}
      <div className="container mx-auto">
        {activeBrand ? (
          /* Show this when a user clicks a brand */
          <ProductBrand 
            selectedBrand={activeBrand} 
            onBack={() => setActiveBrand(null)} 
          />
        ) : (
          /* Default: Show the standard product grid */
          <Products />
        )}
      </div>
    </div>
  );
};

export default HomePage;