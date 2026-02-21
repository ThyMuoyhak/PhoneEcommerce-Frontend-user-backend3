import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Category = ({ onSelectBrand }) => {  // Accept the prop
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get('/products/', {
                params: { limit: 100 }
            });
            
            if (response.data) {
                const productsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.items || response.data.products || [];
                
                // Extract unique brands and categories
                const brandMap = new Map();
                const categoryMap = new Map();
                
                productsData.forEach(product => {
                    // Handle brands
                    const brandName = product.brand;
                    if (brandName && brandName !== 'Unknown Brand') {
                        if (!brandMap.has(brandName)) {
                            brandMap.set(brandName, {
                                id: brandName.toLowerCase().replace(/\s+/g, '-'),
                                name: brandName,
                                type: 'brand',
                                count: 1,
                                image: product.main_image ? `${api.defaults.baseURL}${product.main_image}` : null,
                            });
                        } else {
                            const brand = brandMap.get(brandName);
                            brand.count += 1;
                        }
                    }
                    
                    // Handle categories
                    const categoryName = product.category;
                    if (categoryName && categoryName !== 'Uncategorized') {
                        if (!categoryMap.has(categoryName)) {
                            categoryMap.set(categoryName, {
                                id: categoryName.toLowerCase().replace(/\s+/g, '-'),
                                name: categoryName,
                                type: 'category',
                                count: 1,
                                image: product.main_image ? `${api.defaults.baseURL}${product.main_image}` : null,
                            });
                        } else {
                            const category = categoryMap.get(categoryName);
                            category.count += 1;
                        }
                    }
                });

                // Combine brands and categories
                const brandsArray = Array.from(brandMap.values())
                    .map(item => ({
                        ...item,
                        image: item.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`
                    }))
                    .sort((a, b) => b.count - a.count);

                const categoriesArray = Array.from(categoryMap.values())
                    .map(item => ({
                        ...item,
                        image: item.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`
                    }))
                    .sort((a, b) => b.count - a.count);

                // Store both
                setCategories([...brandsArray, ...categoriesArray]);
                
                // Store products by category
                const productsByCategory = {};
                productsData.forEach(product => {
                    if (product.category) {
                        if (!productsByCategory[product.category]) {
                            productsByCategory[product.category] = [];
                        }
                        productsByCategory[product.category].push(product);
                    }
                });
                setCategoryProducts(productsByCategory);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to server. Please check if the backend is running.');
            } else {
                setError(err.message || 'Failed to fetch categories');
            }
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.type === 'brand') {
            // Call the onSelectBrand function from props for brands
            if (onSelectBrand) {
                onSelectBrand(item.name);
            }
        } else {
            // Navigate to category page for categories
            navigate(`/shop?category=${encodeURIComponent(item.name)}`);
        }
    };

    const getItemIcon = (item) => {
        const name = item.name?.toLowerCase() || '';
        
        if (item.type === 'brand') {
            // Brand icon
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        } else if (name.includes('smartphone') || name.includes('phone') || name.includes('mobile')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            );
        } else if (name.includes('accessory') || name.includes('accessories')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            );
        } else {
            // Default icon
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                    onClick={fetchCategories}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="bg-white py-8 border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Shop by Category & Brand
                    </h2>
                    <p className="text-sm text-gray-500">
                        Click on any brand to see products
                    </p>
                </div>
                
                {/* Marquee / Scrollable Categories */}
                <div className="relative overflow-hidden">
                    <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
                        {categories.map((item) => (
                            <div
                                key={`${item.type}-${item.id}`}
                                onClick={() => handleItemClick(item)}
                                className={`flex-none w-32 text-center cursor-pointer group snap-start transition transform hover:-translate-y-1 ${
                                    item.type === 'brand' ? 'ring-2 ring-blue-100' : ''
                                }`}
                            >
                                <div className="bg-gray-50 rounded-lg p-4 hover:bg-blue-600 transition duration-300">
                                    <div className="w-16 h-16 mx-auto mb-2">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain rounded-lg"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://via.placeholder.com/64x64?text=${encodeURIComponent(item.name[0])}`;
                                            }}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-white transition duration-300 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 group-hover:text-blue-100 transition duration-300">
                                        {item.count} {item.count === 1 ? 'item' : 'items'}
                                    </p>
                                    {item.type === 'brand' && (
                                        <span className="text-[10px] text-blue-600 group-hover:text-white block mt-1 font-semibold">
                                            Click to filter
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Gradient fades for scroll hint */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>
                
                {/* Scroll hint for mobile */}
                <p className="text-xs text-gray-400 text-center mt-4 sm:hidden">
                    ← Scroll to see more →
                </p>
            </div>
        </div>
    );
};

export default Category;