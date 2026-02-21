import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://backend4-phone-ecommerce.onrender.com';

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
    const [brands, setBrands] = useState(['all']);
    const [categories, setCategories] = useState([]);
    
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

    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            // Build query parameters based on filter
            let params = {};
            
            if (filter !== 'all') {
                if (filter === 'deals') {
                    // For deals, we'll filter on the frontend
                } else if (filter === 'new') {
                    // For new products
                } else if (filter === 'featured') {
                    params.featured = true;
                } else {
                    // For category filter
                    params.category = filter;
                }
            }
            
            // Fetch products from API
            const response = await axios.get(`${API_URL}/products/`, { params });
            
            if (response.data) {
                console.log('Fetched products:', response.data);
                
                // Transform API data to match frontend format
                const transformedProducts = response.data.map(product => ({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    category: product.category,
                    price: product.price,
                    originalPrice: product.original_price || product.price,
                    rating: product.rating || 0,
                    reviews: product.reviews || 0,
                    inStock: product.in_stock,
                    featured: product.featured || false,
                    discount: product.discount || 0,
                    colors: product.colors || [],
                    storage: product.storage || [],
                    description: product.description || '',
                    specs: product.specs || {},
                    image: product.main_image ? `${API_URL}/${product.main_image}` : 'https://via.placeholder.com/300x200?text=No+Image',
                    images: product.images ? product.images.map(img => `${API_URL}/${img}`) : []
                }));
                
                setProducts(transformedProducts);
                
                // Extract unique brands
                const uniqueBrands = ['all', ...new Set(transformedProducts.map(p => p.brand).filter(Boolean))];
                setBrands(uniqueBrands);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(transformedProducts.map(p => p.category).filter(Boolean))];
                setCategories(uniqueCategories);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.detail || err.message || 'Failed to fetch products');
            toast.error('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Apply category filter from props
        if (filter !== 'all') {
            switch(filter) {
                case 'smartphones':
                    filtered = filtered.filter(product => product.category?.toLowerCase() === 'smartphones');
                    break;
                case 'accessories':
                    filtered = filtered.filter(product => product.category?.toLowerCase() === 'accessories');
                    break;
                case 'deals':
                    filtered = filtered.filter(product => product.discount > 0);
                    break;
                case 'new':
                    // Sort by ID descending and take newest
                    filtered = [...filtered].sort((a, b) => b.id - a.id);
                    break;
                case 'featured':
                    filtered = filtered.filter(product => product.featured === true);
                    break;
                default:
                    // If filter is a specific category
                    if (categories.includes(filter)) {
                        filtered = filtered.filter(product => 
                            product.category?.toLowerCase() === filter.toLowerCase()
                        );
                    }
                    break;
            }
        }

        // Filter by brand
        if (selectedBrand !== 'all') {
            filtered = filtered.filter(product => 
                product.brand?.toLowerCase() === selectedBrand.toLowerCase()
            );
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(term) ||
                product.brand?.toLowerCase().includes(term) ||
                product.category?.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term)
            );
        }

        // Sort products
        switch(sortBy) {
            case 'price-low':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'discount':
                filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'name-asc':
                filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'name-desc':
                filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
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

    const handleAddToCart = async (e, product) => {
        e.stopPropagation(); // Prevent triggering the product click
        
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, add to cart via API
                await axios.post(`${API_URL}/cart/add`, {
                    product_id: product.id,
                    quantity: 1
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // If not logged in, use localStorage
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
                        quantity: 1,
                        selectedColor: product.colors?.length > 0 ? product.colors[0] : null,
                        selectedStorage: product.storage?.length > 0 ? product.storage[0] : null
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(existingCart));
            }
            
            // Trigger cart update
            if (window.triggerCartUpdate) {
                window.triggerCartUpdate();
            }
            window.dispatchEvent(new Event('cartUpdated'));
            
            // Show success message
            toast.success(`${product.name} added to cart!`);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    const clearAllFilters = () => {
        setSelectedBrand('all');
        setSearchTerm('');
        setSortBy('default');
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-lg mb-4">Error: {error}</p>
                <button 
                    onClick={fetchProducts}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h2>
            
            {/* Filters and Search */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="col-span-1 md:col-span-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
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
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="discount">Biggest Discount</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {(filter !== 'all' || searchTerm || selectedBrand !== 'all' || sortBy !== 'default') && (
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
                    
                    {sortBy !== 'default' && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            Sort: {sortBy.split('-').join(' ')}
                        </span>
                    )}
                    
                    <button 
                        onClick={clearAllFilters}
                        className="text-sm text-red-600 hover:text-red-800 ml-2"
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
                        onClick={clearAllFilters}
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
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
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
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-4">
                                    <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                    
                                    <div className="flex items-center mb-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < Math.floor(product.rating) ? '★' : '☆'}
                                                </span>
                                            ))}
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
                                        {product.inStock && (
                                            <button 
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300 opacity-0 group-hover:opacity-100"
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
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
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first, last, and pages around current
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => paginate(pageNumber)}
                                            className={`w-10 h-10 rounded-lg transition duration-300 ${
                                                currentPage === pageNumber
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return <span key={pageNumber} className="text-gray-400">...</span>;
                                }
                                return null;
                            })}
                            
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