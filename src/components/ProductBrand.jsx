import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ProductBrand = ({ selectedBrand, onClear }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const navigate = useNavigate();

  // Fetch products when selectedBrand changes
  useEffect(() => {
    if (selectedBrand) {
      fetchBrandProducts();
    }
  }, [selectedBrand]);

  const fetchBrandProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/products/', {
        params: { 
          brand: selectedBrand,
          limit: 50 // Get up to 50 products per brand
        }
      });
      
      if (response.data) {
        // Handle both array and paginated responses
        const productsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.items || response.data.products || [];
        
        // Transform API data to match your component's expected format
        const transformedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand || selectedBrand,
          price: parseFloat(product.price) || 0,
          originalPrice: parseFloat(product.original_price) || parseFloat(product.price) || 0,
          description: product.description || 'No description available',
          image: product.main_image 
            ? `${api.defaults.baseURL}${product.main_image}` 
            : 'https://via.placeholder.com/400x400?text=No+Image',
          images: product.images || [],
          rating: parseFloat(product.rating) || 0,
          inStock: product.in_stock !== undefined ? product.in_stock : true,
          discount: parseInt(product.discount) || 0,
          specs: product.specs || {}
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      }
    } catch (err) {
      console.error('Error fetching brand products:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.response?.status === 404) {
        setError('No products found for this brand');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch products');
      }
      
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  useEffect(() => {
    if (products.length > 0) {
      sortProducts();
    }
  }, [sortBy, products]);

  const sortProducts = () => {
    const sorted = [...products];
    
    switch(sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'discount':
        sorted.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Default sort by name
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProducts(sorted);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    if (!product.inStock) {
      toast.error('This product is out of stock');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const cartItem = {
        product_id: product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image
      };

      if (token) {
        await api.post('/cart/add', cartItem);
      } else {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          existingCart[existingItemIndex].quantity += 1;
        } else {
          existingCart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            quantity: 1
          });
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
      }
      
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.detail || 'Failed to add to cart');
    }
  };

  if (!selectedBrand) return null;

  // Loading state
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
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
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchBrandProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Browsing Brand</h2>
          <h1 className="text-5xl font-black text-gray-900">{selectedBrand}</h1>
          <p className="text-gray-500 mt-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="default">Sort by: Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="discount">Biggest Discount</option>
          </select>
          
          <button 
            onClick={onClear}
            className="text-gray-400 hover:text-gray-900 flex items-center gap-2 font-medium"
          >
            View All Models <span>&times;</span>
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No products found for {selectedBrand}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleProductClick(product.id)}
              className="group bg-gray-50 rounded-3xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-50 cursor-pointer"
            >
              <div className="aspect-square mb-6 overflow-hidden rounded-2xl bg-white relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-3xl font-black text-blue-600">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through ml-2 block">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.inStock}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductBrand;