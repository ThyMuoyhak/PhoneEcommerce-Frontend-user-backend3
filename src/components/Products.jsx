import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = ({ filter = 'all', searchQuery: propSearchQuery = '' }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [searchTerm, setSearchTerm] = useState(propSearchQuery);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [toast, setToast] = useState({ show: false, message: '' });
    
    const navigate = useNavigate();

    useEffect(() => {
        setSearchTerm(propSearchQuery);
    }, [propSearchQuery]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, selectedBrand, sortBy, searchTerm, filter]);

    useEffect(() => {
        // Update displayed products based on pagination
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        setDisplayedProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));
    }, [filteredProducts, currentPage, productsPerPage]);

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/products.json');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products);
            setFilteredProducts(data.products);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Apply category filter from props
        if (filter !== 'all') {
            switch(filter) {
                case 'smartphones':
                    filtered = filtered.filter(product => product.category === 'smartphones');
                    break;
                case 'accessories':
                    filtered = filtered.filter(product => product.category === 'accessories');
                    break;
                case 'deals':
                    filtered = filtered.filter(product => product.discount > 0);
                    break;
                case 'new':
                    // Assuming new arrivals are products with id > 8 (you can customize this logic)
                    filtered = filtered.filter(product => product.id > 8);
                    break;
                default:
                    break;
            }
        }

        // Filter by brand
        if (selectedBrand !== 'all') {
            filtered = filtered.filter(product => 
                product.brand.toLowerCase() === selectedBrand.toLowerCase()
            );
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort products
        switch(sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                filtered.sort((a, b) => b.discount - a.discount);
                break;
            default:
                // Default sort by id
                filtered.sort((a, b) => a.id - b.id);
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation(); // Prevent triggering the product click
        
        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already in cart
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            // Increase quantity if already in cart
            existingCart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            existingCart.push({
                ...product,
                quantity: 1,
                selectedColor: product.colors ? product.colors[0] : null,
                selectedStorage: product.storage ? product.storage[0] : null
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(existingCart));
        
        // Trigger cart update in navbar
        if (window.triggerCartUpdate) {
            window.triggerCartUpdate();
        }
        
        // Dispatch custom event for cart update
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Show success message on button
        const button = e.currentTarget;
        const originalText = button.textContent;
        button.textContent = '✓ Added!';
        button.classList.add('bg-green-600', 'hover:bg-green-700');
        button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }, 1500);
        
        // Show toast notification
        setToast({ show: true, message: `${product.name} added to cart!` });
    };

    // Get unique brands for filter
    const brands = ['all', ...new Set(products.map(p => p.brand))];

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of products section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-8">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
                    {toast.message}
                </div>
            )}

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h2>
            
            {/* Filters and Search */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="col-span-1 md:col-span-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Brand Filter */}
                <div>
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {brands.map(brand => (
                            <option key={brand} value={brand}>
                                {brand === 'all' ? 'All Brands' : brand}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="default">Default</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="discount">Biggest Discount</option>
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {(filter !== 'all' || searchTerm || selectedBrand !== 'all') && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {filter !== 'all' && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </span>
                    )}
                    {searchTerm && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            Search: "{searchTerm}"
                        </span>
                    )}
                    {selectedBrand !== 'all' && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            {selectedBrand}
                        </span>
                    )}
                    <button 
                        onClick={() => {
                            setSelectedBrand('all');
                            setSearchTerm('');
                            setSortBy('default');
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Results count */}
            <p className="text-gray-600 mb-4">
                Showing {displayedProducts.length} of {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">No products found</p>
                    <button 
                        onClick={() => {
                            setSelectedBrand('all');
                            setSearchTerm('');
                            setSortBy('default');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                            <div 
                                key={product.id} 
                                onClick={() => handleProductClick(product.id)}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    />
                                    {product.discount > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            -{product.discount}%
                                        </div>
                                    )}
                                    {product.featured && (
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-4">
                                    <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                    
                                    <div className="flex items-center mb-2">
                                        <div className="flex text-yellow-400">
                                            {'★'.repeat(Math.floor(product.rating))}
                                            {'☆'.repeat(5 - Math.floor(product.rating))}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                            {product.originalPrice > product.price && (
                                                <span className="text-sm text-gray-400 line-through ml-2">
                                                    ${product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className={`${
                                                !product.inStock 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            } text-white px-3 py-1 rounded text-sm transition duration-300 opacity-0 group-hover:opacity-100`}
                                            disabled={!product.inStock}
                                        >
                                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>

                                    {/* Stock Status */}
                                    {!product.inStock && (
                                        <div className="mt-2 text-sm text-red-500">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg transition duration-300 ${
                                    currentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            >
                                Previous
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`w-10 h-10 rounded-lg transition duration-300 ${
                                        currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg transition duration-300 ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;