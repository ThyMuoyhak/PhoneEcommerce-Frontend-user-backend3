import React, { useState, useEffect } from 'react';

const ProductBrand = ({ selectedBrand, onClear }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch('./products.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  // Filter products whenever the selectedBrand changes
  useEffect(() => {
    if (selectedBrand) {
      const filtered = products.filter(p => p.brand === selectedBrand);
      setFilteredProducts(filtered);
    }
  }, [selectedBrand, products]);

  if (!selectedBrand) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Browsing Brand</h2>
          <h1 className="text-5xl font-black text-gray-900">{selectedBrand}</h1>
        </div>
        <button 
          onClick={onClear}
          className="text-gray-400 hover:text-gray-900 flex items-center gap-2 font-medium"
        >
          View All Models <span>&times;</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-gray-50 rounded-3xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-50">
            <div className="aspect-square mb-6 overflow-hidden rounded-2xl bg-white">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-black text-blue-600">${product.price}</span>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductBrand;