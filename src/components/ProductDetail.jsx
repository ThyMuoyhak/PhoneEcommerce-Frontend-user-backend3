import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://backend4-phone-ecommerce.onrender.com';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            
            // Fetch product from API
            const response = await axios.get(`${API_URL}/products/${id}`);
            
            if (response.data) {
                console.log('Product details:', response.data);
                
                // Transform API data to match frontend format
                const productData = {
                    id: response.data.id,
                    name: response.data.name,
                    brand: response.data.brand,
                    category: response.data.category,
                    price: response.data.price,
                    originalPrice: response.data.original_price || response.data.price,
                    rating: response.data.rating || 0,
                    reviews: response.data.reviews || 0,
                    inStock: response.data.in_stock,
                    featured: response.data.featured || false,
                    discount: response.data.discount || 0,
                    colors: response.data.colors || [],
                    storage: response.data.storage || [],
                    description: response.data.description || '',
                    specs: response.data.specs || {},
                    image: response.data.main_image ? `${API_URL}/${response.data.main_image}` : 'https://via.placeholder.com/600x400?text=No+Image',
                    images: response.data.images && response.data.images.length > 0 
                        ? response.data.images.map(img => `${API_URL}/${img}`)
                        : response.data.main_image 
                            ? [`${API_URL}/${response.data.main_image}`]
                            : ['https://via.placeholder.com/600x400?text=No+Image']
                };
                
                setProduct(productData);
                
                // Set default selections
                if (productData.colors && productData.colors.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }
                if (productData.storage && productData.storage.length > 0) {
                    setSelectedStorage(productData.storage[0]);
                }
                
                // Fetch related products from same category
                fetchRelatedProducts(productData.category, productData.id);
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError(err.response?.data?.detail || err.message || 'Failed to fetch product details');
            toast.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (category, currentProductId) => {
        try {
            const response = await axios.get(`${API_URL}/products/`, {
                params: { category: category, limit: 4 }
            });
            
            if (response.data) {
                // Filter out current product and transform data
                const related = response.data
                    .filter(p => p.id !== currentProductId)
                    .slice(0, 4)
                    .map(p => ({
                        id: p.id,
                        name: p.name,
                        brand: p.brand,
                        price: p.price,
                        originalPrice: p.original_price || p.price,
                        rating: p.rating || 0,
                        image: p.main_image ? `${API_URL}/${p.main_image}` : 'https://via.placeholder.com/200x200?text=No+Image',
                        discount: p.discount || 0
                    }));
                
                setRelatedProducts(related);
            }
        } catch (err) {
            console.error('Error fetching related products:', err);
        }
    };

    const handleQuantityChange = (action) => {
        if (action === 'increment' && quantity < 10) {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const cartItem = {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image,
                quantity: quantity,
                selectedColor: selectedColor,
                selectedStorage: selectedStorage
            };

            if (token) {
                // If logged in, add to cart via API
                await axios.post(`${API_URL}/cart/add`, cartItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // If not logged in, use localStorage
                const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
                
                const existingItemIndex = existingCart.findIndex(item => 
                    item.id === product.id && 
                    item.selectedColor === selectedColor && 
                    item.selectedStorage === selectedStorage
                );
                
                if (existingItemIndex >= 0) {
                    existingCart[existingItemIndex].quantity += quantity;
                } else {
                    existingCart.push(cartItem);
                }
                
                localStorage.setItem('cart', JSON.stringify(existingCart));
            }
            
            // Trigger cart update
            if (window.triggerCartUpdate) {
                window.triggerCartUpdate();
            }
            window.dispatchEvent(new Event('cartUpdated'));
            
            toast.success(`${product.name} added to cart!`);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const handleRelatedProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-6">{error || 'Product not found'}</p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-blue-600">
                    Home
                </button>
                <span className="mx-2 text-gray-400">/</span>
                <button 
                    onClick={() => navigate(`/category/${product.category}`)} 
                    className="text-gray-500 hover:text-blue-600"
                >
                    {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
                </button>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div>
                    {/* Main Image */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
                        <img 
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                            }}
                        />
                    </div>
                    
                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`bg-gray-100 rounded-lg overflow-hidden h-24 border-2 transition duration-300 ${
                                        selectedImage === index 
                                            ? 'border-blue-600' 
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <img 
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    {/* Brand and Name */}
                    <div className="mb-4">
                        <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                            {product.brand}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-1">
                            {product.name}
                        </h1>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 text-lg">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                    {i < Math.floor(product.rating) ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span className="text-gray-600 ml-2">
                            ({product.reviews} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        {product.discount > 0 ? (
                            <div className="flex items-center flex-wrap gap-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through ml-2">
                                    ${product.originalPrice}
                                </span>
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm ml-2">
                                    Save {product.discount}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                        )}
                    </div>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-lg border transition duration-300 ${
                                            selectedColor === color
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Storage Selection */}
                    {product.storage && product.storage.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Storage: <span className="font-normal text-gray-600">{selectedStorage}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.storage.map((storage) => (
                                    <button
                                        key={storage}
                                        onClick={() => setSelectedStorage(storage)}
                                        className={`px-4 py-2 rounded-lg border transition duration-300 ${
                                            selectedStorage === storage
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {storage}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleQuantityChange('decrement')}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-300"
                                disabled={!product.inStock}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange('increment')}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-300"
                                disabled={!product.inStock}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                        {product.inStock ? (
                            <span className="text-green-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                In Stock
                            </span>
                        ) : (
                            <span className="text-red-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={!product.inStock}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Product Description */}
                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.description || 'No description available.'}
                        </p>
                    </div>

                    {/* Specifications */}
                    {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="border-b border-gray-100 pb-2">
                                        <span className="text-sm text-gray-500 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                        </span>
                                        <span className="text-sm text-gray-900 block font-medium">
                                            {value || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <div 
                                key={relatedProduct.id}
                                onClick={() => handleRelatedProductClick(relatedProduct.id)}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={relatedProduct.image}
                                        alt={relatedProduct.name}
                                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                        }}
                                    />
                                    {relatedProduct.discount > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            -{relatedProduct.discount}%
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="text-sm text-gray-500 mb-1">{relatedProduct.brand}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                    <div className="flex items-center mb-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < Math.floor(relatedProduct.rating) ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">${relatedProduct.price}</span>
                                        {relatedProduct.originalPrice > relatedProduct.price && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ${relatedProduct.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;