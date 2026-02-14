import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch deals from products.json
        fetch('/products.json')
            .then(res => res.json())
            .then(data => {
                const discountedProducts = data.products.filter(p => p.discount > 0);
                setDeals(discountedProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching deals:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
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
                        <span className="text-2xl font-bold">24</span>
                        <span className="text-sm ml-1">Hours</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
                        <span className="text-2xl font-bold">60</span>
                        <span className="text-sm ml-1">Mins</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
                        <span className="text-2xl font-bold">30</span>
                        <span className="text-sm ml-1">Secs</span>
                    </div>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal) => (
                    <Link 
                        to={`/product/${deal.id}`}
                        key={deal.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                    >
                        <div className="relative h-48">
                            <img 
                                src={deal.image} 
                                alt={deal.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                -{deal.discount}%
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-sm text-gray-500 mb-1">{deal.brand}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.name}</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">${deal.price}</span>
                                    <span className="text-sm text-gray-400 line-through ml-2">
                                        ${deal.originalPrice}
                                    </span>
                                </div>
                                <span className="text-green-600 font-semibold">
                                    Save ${(deal.originalPrice - deal.price).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Exclusive Deals!</h2>
                <p className="text-gray-600 mb-6">Subscribe to our newsletter and get 10% off your first purchase</p>
                <div className="max-w-md mx-auto flex space-x-2">
                    <input 
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Deals;