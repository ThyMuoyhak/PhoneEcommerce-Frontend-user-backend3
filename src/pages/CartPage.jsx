import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Load cart from localStorage
    useEffect(() => {
        loadCartFromStorage();
        
        // Listen for cart updates from other components
        window.addEventListener('cartUpdated', loadCartFromStorage);
        window.addEventListener('storage', loadCartFromStorage);
        
        return () => {
            window.removeEventListener('cartUpdated', loadCartFromStorage);
            window.removeEventListener('storage', loadCartFromStorage);
        };
    }, []);

    // Auto-hide toast
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '', type: 'success' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const loadCartFromStorage = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
        setLoading(false);
        
        // Update navbar cart count
        if (window.triggerCartUpdate) {
            window.triggerCartUpdate();
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Trigger cart update in navbar
        if (window.triggerCartUpdate) {
            window.triggerCartUpdate();
        }
        
        // Dispatch custom event
        window.dispatchEvent(new Event('cartUpdated'));
        
        setToast({
            show: true,
            message: 'Cart updated successfully!',
            type: 'success'
        });
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Trigger cart update in navbar
        if (window.triggerCartUpdate) {
            window.triggerCartUpdate();
        }
        
        // Dispatch custom event
        window.dispatchEvent(new Event('cartUpdated'));
        
        setToast({
            show: true,
            message: 'Item removed from cart',
            type: 'info'
        });
    };

    const applyPromoCode = () => {
        // Mock promo codes
        const validPromos = {
            'SAVE10': 10,
            'SAVE20': 20,
            'PHONE15': 15,
            'WELCOME5': 5,
            'FLASH25': 25
        };

        const code = promoCode.trim().toUpperCase();
        
        if (validPromos[code]) {
            setDiscount(validPromos[code]);
            setPromoError('');
            setToast({
                show: true,
                message: `${validPromos[code]}% discount applied!`,
                type: 'success'
            });
        } else {
            setPromoError('Invalid promo code');
            setDiscount(0);
            setToast({
                show: true,
                message: 'Invalid promo code',
                type: 'error'
            });
        }
    };

    const clearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            localStorage.removeItem('cart');
            setCartItems([]);
            
            // Trigger cart update in navbar
            if (window.triggerCartUpdate) {
                window.triggerCartUpdate();
            }
            
            window.dispatchEvent(new Event('cartUpdated'));
            
            setToast({
                show: true,
                message: 'Cart cleared successfully',
                type: 'info'
            });
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = (subtotal - discountAmount) * 0.08; // 8% tax
    const total = subtotal - discountAmount + shipping + tax;

    // Get related products (random selection from cart items brands)
    const getRelatedProducts = () => {
        // In a real app, this would fetch from API based on cart items
        return [
            {
                id: 101,
                name: "iPhone 15 Pro Case",
                brand: "Apple",
                price: 49.99,
                image: "https://images.unsplash.com/photo-1592751869208-5d3b4c8f2d9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                id: 102,
                name: "Samsung Galaxy Buds2 Pro",
                brand: "Samsung",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                id: 103,
                name: "Apple MagSafe Charger",
                brand: "Apple",
                price: 39.99,
                image: "https://images.unsplash.com/photo-1583863788434-e58a36330bcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                id: 104,
                name: "Google Pixel Watch",
                brand: "Google",
                price: 349.99,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ];
    };

    const relatedProducts = getRelatedProducts();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link 
                        to="/shop" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-4 right-4 ${
                    toast.type === 'success' ? 'bg-green-500' : 
                    toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                } text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`}>
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                {cartItems.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Clear Cart</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Cart Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        {/* Cart Items */}
                        {cartItems.map((item) => (
                            <div key={item.id} className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* Product Info */}
                                    <div className="md:col-span-6 flex space-x-4">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <Link 
                                                to={`/product/${item.id}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{item.brand}</p>
                                            {item.color && (
                                                <p className="text-sm text-gray-500">Color: {item.color}</p>
                                            )}
                                            {item.storage && (
                                                <p className="text-sm text-gray-500">Storage: {item.storage}</p>
                                            )}
                                            {item.discount > 0 && (
                                                <p className="text-sm text-green-600">Save {item.discount}%</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="md:col-span-2 text-center">
                                        <span className="md:hidden text-sm text-gray-500 mr-2">Price:</span>
                                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                ${item.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-blue-500 transition duration-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-blue-500 transition duration-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total & Remove */}
                                    <div className="md:col-span-2 flex items-center justify-between md:justify-end space-x-4">
                                        <span className="md:hidden text-sm text-gray-500">Total:</span>
                                        <span className="font-bold text-blue-600">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700 transition duration-300"
                                            title="Remove item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                            <Link 
                                to="/shop" 
                                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Continue Shopping
                            </Link>
                            <span className="text-sm text-gray-500">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                        {/* Promo Code */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Promo Code
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={applyPromoCode}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition duration-300"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoError && (
                                <p className="text-red-500 text-sm mt-1">{promoError}</p>
                            )}
                            {discount > 0 && (
                                <p className="text-green-600 text-sm mt-1">
                                    {discount}% discount applied!
                                </p>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount ({discount}%)</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-xl text-blue-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 mb-3 transform hover:scale-105"
                        >
                            Proceed to Checkout
                        </button>

                        {/* Payment Methods */}
                        <div className="text-center text-sm text-gray-500">
                            <p className="mb-2">We accept:</p>
                            <div className="flex justify-center space-x-4">
                                <span className="text-2xl hover:scale-110 transition duration-300 cursor-default" title="Visa">💳</span>
                                <span className="text-2xl hover:scale-110 transition duration-300 cursor-default" title="Mastercard">💳</span>
                                <span className="text-2xl hover:scale-110 transition duration-300 cursor-default" title="PayPal">📱</span>
                                <span className="text-2xl hover:scale-110 transition duration-300 cursor-default" title="Apple Pay">🍎</span>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure Checkout - SSL Encrypted
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((product) => (
                            <Link 
                                to={`/product/${product.id}`}
                                key={product.id} 
                                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
                            >
                                <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                                <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;