import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-16">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            Phone<span className="text-blue-500">Hub</span>
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Your one-stop shop for the latest smartphones and accessories. 
                            We bring you the best deals on top brands.
                        </p>
                        <div className="flex space-x-4">
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-lg hover:bg-blue-400 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://youtube.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition duration-300">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-gray-400 hover:text-white transition duration-300">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link to="/deals" className="text-gray-400 hover:text-white transition duration-300">
                                    Today's Deals
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-400 hover:text-white transition duration-300">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-white transition duration-300">
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/shop?category=smartphones" className="text-gray-400 hover:text-white transition duration-300">
                                    Smartphones
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=accessories" className="text-gray-400 hover:text-white transition duration-300">
                                    Accessories
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=smartwatches" className="text-gray-400 hover:text-white transition duration-300">
                                    Smartwatches
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=audio" className="text-gray-400 hover:text-white transition duration-300">
                                    Audio
                                </Link>
                            </li>
                            <li>
                                <Link to="/deals" className="text-gray-400 hover:text-white transition duration-300">
                                    Special Offers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>123 Phone Street, Tech City, TC 12345</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+1 (800) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>support@phonehub.com</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Mon-Fri: 9AM - 6PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h4>
                            <p className="text-gray-400">Get the latest updates on new products and upcoming sales</p>
                        </div>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} PhoneHub. All rights reserved.
                        </p>
                        
                        {/* Payment Methods */}
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400 text-sm">We accept:</span>
                            <div className="flex space-x-2">
                                <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">Visa</span>
                                <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">Mastercard</span>
                                <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">PayPal</span>
                                <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">Apple Pay</span>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="flex space-x-6">
                            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition duration-300">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition duration-300">
                                Terms of Service
                            </Link>
                            <Link to="/shipping" className="text-gray-400 hover:text-white text-sm transition duration-300">
                                Shipping Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;