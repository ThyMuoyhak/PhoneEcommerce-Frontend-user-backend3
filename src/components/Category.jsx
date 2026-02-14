import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/products.json');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.categories);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryName) => {
        // Convert category name to slug format
        const categorySlug = categoryName.toLowerCase();
        
        // Navigate to shop page with category filter
        navigate(`/shop?category=${categorySlug}`);
    };

    const handleShopNowClick = (e, categoryName) => {
        e.stopPropagation(); // Prevent triggering the parent click
        handleCategoryClick(categoryName);
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
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                <p className="text-gray-600">Browse our wide range of phone categories</p>
            </div>

            {/* Main Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        onClick={() => handleCategoryClick(category.name)}
                        className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                    >
                        {/* Category Image */}
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={category.image} 
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        </div>
                        
                        {/* Category Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-200 mb-3">{category.count} Products</p>
                            <button 
                                onClick={(e) => handleShopNowClick(e, category.name)}
                                className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popular Categories - Grid View */}
            <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div 
                            key={`card-${category.id}`}
                            onClick={() => handleCategoryClick(category.name)}
                            className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition duration-300 cursor-pointer group"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition duration-300">
                                {category.name === "Smartphones" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                )}
                                {category.name === "Accessories" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                )}
                                {category.name === "Smartwatches" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {category.name === "Audio" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                            <p className="text-sm text-gray-500">{category.count} Items</p>
                            <button className="mt-3 text-blue-600 group-hover:text-blue-800 text-sm font-semibold opacity-0 group-hover:opacity-100 transition duration-300">
                                Shop Now →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Categories Banner */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
                        <p className="text-blue-100 mb-6">Browse all our categories and discover amazing products at great prices.</p>
                        <button 
                            onClick={() => navigate('/shop')}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
                        >
                            View All Products
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.slice(0, 4).map((category) => (
                            <div 
                                key={`banner-${category.id}`}
                                onClick={() => handleCategoryClick(category.name)}
                                className="bg-white bg-opacity-20 rounded-lg p-4 text-center cursor-pointer hover:bg-opacity-30 transition duration-300"
                            >
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-blue-100">{category.count} products</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;