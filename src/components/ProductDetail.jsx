import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch('/products.json');
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const data = await response.json();
            const foundProduct = data.products.find(p => p.id === parseInt(id));
            
            if (!foundProduct) {
                throw new Error('Product not found');
            }
            
            setProduct(foundProduct);
            if (foundProduct.colors) setSelectedColor(foundProduct.colors[0]);
            if (foundProduct.storage) setSelectedStorage(foundProduct.storage[0]);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleQuantityChange = (action) => {
        if (action === 'increment' && quantity < 10) {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log('Added to cart:', {
            ...product,
            selectedColor,
            selectedStorage,
            quantity
        });
    };

    const handleBuyNow = () => {
        // Buy now logic here
        console.log('Buy now:', {
            ...product,
            selectedColor,
            selectedStorage,
            quantity
        });
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
                <a href="/" className="text-gray-500 hover:text-blue-600">Home</a>
                <span className="mx-2 text-gray-400">/</span>
                <a href={`/category/${product.category}`} className="text-gray-500 hover:text-blue-600">
                    {product.category}
                </a>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div>
                    {/* Main Image */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
                        <img 
                            src={product.images[selectedImage] || product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    
                    {/* Thumbnail Images */}
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
                                />
                            </button>
                        ))}
                    </div>
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
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span className="text-gray-600 ml-2">
                            ({product.reviews} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        {product.discount > 0 ? (
                            <div className="flex items-center">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through ml-3">
                                    ${product.originalPrice}
                                </span>
                                <span className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-sm">
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
                            <div className="flex space-x-3">
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
                            <div className="flex space-x-3">
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
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange('increment')}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-300"
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
                    <div className="flex space-x-4 mb-8">
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
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Specifications */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="border-b border-gray-100 pb-2">
                                    <span className="text-sm text-gray-500 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                    </span>
                                    <span className="text-sm text-gray-900 block font-medium">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;