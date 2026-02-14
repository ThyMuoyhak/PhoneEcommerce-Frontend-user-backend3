// pages/Checkout.js
import { Link } from 'react-router-dom';

const Checkout = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
                <p className="text-gray-600 mb-8">Checkout page is under construction</p>
                <Link 
                    to="/cart" 
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                    ← Back to Cart
                </Link>
            </div>
        </div>
    );
};

export default Checkout;