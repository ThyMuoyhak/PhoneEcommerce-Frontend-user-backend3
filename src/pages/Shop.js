// pages/Shop.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Products from '../components/Products';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const [activeFilter, setActiveFilter] = useState(categoryParam || 'all');

    useEffect(() => {
        if (categoryParam) {
            setActiveFilter(categoryParam);
        }
    }, [categoryParam]);

    return (
        <div>
            {searchQuery && (
                <div className="bg-blue-50 py-4 border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-blue-800">
                            Search results for: <span className="font-semibold">"{searchQuery}"</span>
                        </p>
                    </div>
                </div>
            )}
            
            {categoryParam && (
                <div className="bg-green-50 py-4 border-b border-green-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-green-800">
                            Showing products in: <span className="font-semibold capitalize">"{categoryParam}"</span>
                        </p>
                    </div>
                </div>
            )}
            
            {/* Category quick filters */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-8 overflow-x-auto py-4">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                activeFilter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Products
                        </button>
                        <button 
                            onClick={() => setActiveFilter('smartphones')}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                activeFilter === 'smartphones' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Smartphones
                        </button>
                        <button 
                            onClick={() => setActiveFilter('accessories')}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                activeFilter === 'accessories' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Accessories
                        </button>
                        <button 
                            onClick={() => setActiveFilter('deals')}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                activeFilter === 'deals' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Today's Deals
                        </button>
                        <button 
                            onClick={() => setActiveFilter('new')}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                activeFilter === 'new' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            New Arrivals
                        </button>
                    </div>
                </div>
            </div>

            <Products filter={activeFilter} searchQuery={searchQuery} />
        </div>
    );
};

export default Shop;