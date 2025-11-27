import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Truck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart, updateQuantity } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [pincode, setPincode] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [checkingPincode, setCheckingPincode] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Fetch product by slug
                const response = await axios.get(`${API_URL}/products/${slug}`);
                setProduct(response.data);

                // Parse images if it's a string (JSON)
                if (typeof response.data.images === 'string') {
                    response.data.images = JSON.parse(response.data.images);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Product not found");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    useEffect(() => {
        if (user && user.pincode) {
            setPincode(user.pincode);
            checkDelivery(user.pincode);
        }
    }, [user]);

    const cartItem = product ? cart.find(item => item.id === product.id) : null;
    const quantity = cartItem ? cartItem.quantity : 0;

    const checkDelivery = (code) => {
        if (!/^[1-9][0-9]{5}$/.test(code)) {
            setDeliveryDate(null);
            return;
        }
        setCheckingPincode(true);

        // Mock Logic: Calculate distance based on difference from 400028
        setTimeout(() => {
            const diff = Math.abs(parseInt(code) - 400028);
            let days = 0;

            if (diff < 100) days = 1; // Same area
            else if (diff < 1000) days = 2; // Same city
            else if (diff < 10000) days = 3; // Same state
            else days = 5; // Different state

            const date = new Date();
            date.setDate(date.getDate() + days);
            setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }));
            setCheckingPincode(false);
        }, 500);
    };

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <button onClick={() => navigate('/shop')} className="btn btn-primary">Back to Shop</button>
            </div>
        );
    }

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-[var(--color-primary)] mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-24 h-32 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-[var(--color-primary)]' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm uppercase">
                            {product.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-4 text-gray-900">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-3 mb-6">
                            {product.discount_percent > 0 ? (
                                <>
                                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                                        ₹{(product.price * (1 - product.discount_percent / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                    <p className="text-gray-400 text-xl line-through">
                                        ₹{Number(product.price).toLocaleString()}
                                    </p>
                                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                                        {product.discount_percent}% OFF
                                    </span>
                                </>
                            ) : (
                                <p className="text-2xl font-bold text-[var(--color-primary)]">
                                    ₹{Number(product.price).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-6">
                            <p>{product.description}</p>
                        </div>

                        {product.fabric_type && (
                            <div className="mb-6">
                                <span className="text-sm font-medium text-gray-700">Fabric: </span>
                                <span className="text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{product.fabric_type}</span>
                            </div>
                        )}

                        {product.size && (
                            <div className="mb-6">
                                <span className="text-sm font-medium text-gray-700">Size: </span>
                                <span className="text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{product.size}</span>
                            </div>
                        )}

                        {/* Color Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <span className="text-sm font-medium text-gray-900 block mb-2">Available Colors</span>
                                <div className="flex items-center gap-3">
                                    {/* Current Product Color */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] shadow-sm cursor-default"
                                            style={{ backgroundColor: product.color ? product.color.toLowerCase() : '#ccc' }}
                                            title={product.color}
                                        ></div>
                                        <span className="text-xs text-[var(--color-primary)] font-medium">{product.color}</span>
                                    </div>

                                    {/* Other Variants */}
                                    {product.variants.map(variant => (
                                        <Link
                                            key={variant.id}
                                            to={`/product/${variant.slug}`}
                                            className="flex flex-col items-center gap-1 group"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full border border-gray-200 shadow-sm group-hover:border-gray-400 transition-colors"
                                                style={{ backgroundColor: variant.color ? variant.color.toLowerCase() : '#ccc' }}
                                                title={variant.color}
                                            ></div>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-700">{variant.color}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pincode Check */}
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                                <MapPin size={16} /> Check Delivery Availability
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Pincode"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    maxLength={6}
                                />
                                <button
                                    onClick={() => checkDelivery(pincode)}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800"
                                    disabled={checkingPincode}
                                >
                                    Check
                                </button>
                            </div>
                            {deliveryDate && (
                                <div className="mt-3 flex items-start gap-2 text-sm text-green-700">
                                    <Truck size={16} className="mt-0.5 flex-shrink-0" />
                                    <span>
                                        Estimated delivery by <strong>{deliveryDate}</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Add to Cart / Quantity / Buy Now */}
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                {quantity > 0 ? (
                                    <div className="flex items-center border border-gray-300 rounded-full w-full max-w-[200px]">
                                        <button
                                            onClick={() => updateQuantity(product.id, quantity - 1)}
                                            className="p-4 hover:bg-gray-50 text-gray-600 rounded-l-full"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="flex-1 text-center font-medium text-lg">{quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id, quantity + 1)}
                                            className="p-4 hover:bg-gray-50 text-gray-600 rounded-r-full"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-4 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={20} />
                                        Add to Cart
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (quantity === 0) addToCart(product, 1);
                                        navigate('/cart');
                                    }}
                                    className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-full font-medium hover:bg-[var(--color-accent)] transition-colors shadow-md"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 text-sm text-gray-500">
                            <p>• 100% Authentic Handloom</p>
                            <p>• Free Shipping across India</p>
                            <p>• Easy Returns within 7 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
