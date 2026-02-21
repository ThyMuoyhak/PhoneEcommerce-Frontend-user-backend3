import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Check login status and load cart on component mount
    useEffect(() => {
        checkLoginStatus();
        updateCartCount();
        
        // Listen for storage events (in case cart is updated in another tab)
        window.addEventListener('storage', handleStorageChange);
        
        // Custom event listener for cart updates
        window.addEventListener('cartUpdated', updateCartCount);
        
        // Custom event listener for login/logout
        window.addEventListener('authChange', checkLoginStatus);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('authChange', checkLoginStatus);
        };
    }, []);

    const handleStorageChange = (e) => {
        if (e.key === 'token' || e.key === 'cart') {
            checkLoginStatus();
            updateCartCount();
        }
    };

    const checkLoginStatus = async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // Verify token and get user info
                const response = await axios.get(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data) {
                    setIsLoggedIn(true);
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Auth error:', error);
                // Token might be expired
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUser(null);
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    const updateCartCount = async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            // If logged in, get cart from API
            try {
                const response = await axios.get(`${API_URL}/cart/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.items) {
                    const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
                    setCartCount(totalItems);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                // Fallback to localStorage
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalItems);
            }
        } else {
            // If not logged in, get cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsMobileMenuOpen(false);
        }
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleUserClick = () => {
        if (isLoggedIn) {
            setIsUserMenuOpen(!isUserMenuOpen);
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        setIsUserMenuOpen(false);
        updateCartCount();
        
        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));
        
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleProfileClick = () => {
        setIsUserMenuOpen(false);
        navigate('/profile');
    };

    const handleOrdersClick = () => {
        setIsUserMenuOpen(false);
        navigate('/orders');
    };

    // Function to manually trigger cart update (can be called from other components)
    const triggerCartUpdate = () => {
        updateCartCount();
    };

    // Make triggerCartUpdate available globally
    useEffect(() => {
        window.triggerCartUpdate = triggerCartUpdate;
        return () => {
            delete window.triggerCartUpdate;
        };
    }, []);

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-gray-800">
                            Phone<span className="text-blue-600">Hub</span>
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            to="/" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/shop" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150"
                        >
                            Shop
                        </Link>
                        <Link 
                            to="/deals" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150"
                        >
                            Deals
                        </Link>
                        <Link 
                            to="/support" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150"
                        >
                            Support
                        </Link>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Search Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:block relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 px-4 py-1.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* Search Icon - Mobile */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-600 hover:text-blue-600 transition duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <button 
                            onClick={handleCartClick}
                            className="text-gray-600 hover:text-blue-600 transition duration-150 relative group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <>
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-ping opacity-75">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                </>
                            )}
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button 
                                onClick={handleUserClick}
                                className="text-gray-600 hover:text-blue-600 transition duration-150 flex items-center space-x-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {isLoggedIn && user && (
                                    <span className="hidden md:inline text-sm text-gray-700">
                                        {user.full_name?.split(' ')[0] || user.username}
                                    </span>
                                )}
                            </button>

                            {/* User Dropdown Menu */}
                            {isLoggedIn && isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                    <button
                                        onClick={handleProfileClick}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150"
                                    >
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </div>
                                    </button>
                                    <button
                                        onClick={handleOrdersClick}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150"
                                    >
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Orders
                                        </div>
                                    </button>
                                    <hr className="my-1 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150"
                                    >
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-200">
                        {/* Mobile Search Bar */}
                        <form onSubmit={handleSearch} className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-1">
                            <Link 
                                to="/" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/shop" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150"
                            >
                                Shop
                            </Link>
                            <Link 
                                to="/deals" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150"
                            >
                                Deals
                            </Link>
                            <Link 
                                to="/support" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150"
                            >
                                Support
                            </Link>
                            
                            {/* User related links for mobile */}
                            {isLoggedIn ? (
                                <>
                                    <hr className="my-2 border-gray-200" />
                                    <Link 
                                        to="/profile" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150"
                                    >
                                        Profile
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150"
                                    >
                                        Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-150"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <hr className="my-2 border-gray-200" />
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-150"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-150"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;