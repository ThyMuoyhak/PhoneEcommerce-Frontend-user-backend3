import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 60,
        seconds: 30
    });

    useEffect(() => {
        fetchDeals();
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            
            // Fetch all products from API
            const response = await axios.get(`${API_URL}/products/`);
            
            if (response.data) {
                console.log('Products fetched for deals:', response.data);
                
                // Filter products with discount > 0
                const discountedProducts = response.data
                    .filter(product => product.discount > 0)
                    .map(product => ({
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        category: product.category,
                        price: product.price,
                        originalPrice: product.original_price || product.price,
                        discount: product.discount,
                        rating: product.rating || 0,
                        reviews: product.reviews || 0,
                        inStock: product.in_stock,
                        image: product.main_image ? `${API_URL}/${product.main_image}` : 'https://via.placeholder.com/300x200?text=No+Image',
                        description: product.description || ''
                    }))
                    .sort((a, b) => b.discount - a.discount); // Sort by highest discount first
                
                setDeals(discountedProducts);
            }
        } catch (err) {
            console.error('Error fetching deals:', err);
            setError(err.response?.data?.detail || err.message || 'Failed to fetch deals');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    const calculateSavings = (originalPrice, price) => {
        return (originalPrice - price).toFixed(2);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-lg mb-4">Error: {error}</p>
                <button 
                    onClick={fetchDeals}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 mb-12 text-white">
                <h1 className="text-4xl font-bold mb-4">Today's Best Deals 🔥</h1>
                <p className="text-xl mb-6">Limited time offers. Grab them before they're gone!</p>
                <div className="flex space-x-4">
                    <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
                        <span className="text-2xl font-bold">{formatNumber(timeLeft.hours)}</span>
                        <span className="text-sm ml-1">Hours</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
                        <span className="text-2xl font-bold">{formatNumber(timeLeft.minutes)}</span>
                        <span className="text-sm ml-1">Mins</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
                        <span className="text-2xl font-bold">{formatNumber(timeLeft.seconds)}</span>
                        <span className="text-sm ml-1">Secs</span>
                    </div>
                </div>
            </div>

            {/* Deals Stats */}
            {deals.length > 0 && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-green-600 text-sm font-semibold mb-1">Total Deals</p>
                        <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-blue-600 text-sm font-semibold mb-1">Average Discount</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {Math.round(deals.reduce((sum, deal) => sum + deal.discount, 0) / deals.length)}%
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-purple-600 text-sm font-semibold mb-1">Biggest Discount</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {Math.max(...deals.map(deal => deal.discount))}%
                        </p>
                    </div>
                </div>
            )}

            {/* No Deals Message */}
            {deals.length === 0 && (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">No active deals at the moment</p>
                    <p className="text-gray-400 mb-6">Check back later for exciting offers!</p>
                    <Link 
                        to="/shop"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 inline-block"
                    >
                        Browse All Products
                    </Link>
                </div>
            )}

            {/* Deals Grid */}
            {deals.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal) => (
                            <Link 
                                to={`/product/${deal.id}`}
                                key={deal.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={deal.image} 
                                        alt={deal.name}
                                        className="w-full h-full object-cover hover:scale-110 transition duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                        -{deal.discount}%
                                    </div>
                                    {!deal.inStock && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="text-sm text-gray-500 mb-1">{deal.brand}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{deal.name}</h3>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center mb-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < Math.floor(deal.rating) ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">({deal.reviews})</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">${deal.price}</span>
                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                ${deal.originalPrice}
                                            </span>
                                        </div>
                                        <span className="text-green-600 font-semibold text-sm">
                                            Save ${calculateSavings(deal.originalPrice, deal.price)}
                                        </span>
                                    </div>

                                    {/* Progress Bar (fake stock indicator) */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Sold: {Math.floor(Math.random() * 70) + 20}%</span>
                                            <span>Limited stock!</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-red-500 h-2 rounded-full" 
                                                style={{ width: `${Math.floor(Math.random() * 70) + 20}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View All Deals Button */}
                    <div className="text-center mt-8">
                        <Link 
                            to="/shop?deals=true"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center"
                        >
                            View All Deals
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </>
            )}

            {/* Newsletter Signup */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Get Exclusive Deals!</h2>
                <p className="text-blue-100 mb-6">Subscribe to our newsletter and get 10% off your first purchase</p>
                <div className="max-w-md mx-auto">
                    <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input 
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button 
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition duration-300 whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-blue-200 mt-3">
                        By subscribing, you agree to receive marketing emails from us.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Deals;