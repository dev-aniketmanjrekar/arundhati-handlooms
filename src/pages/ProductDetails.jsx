import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Truck, MapPin, ChevronDown, ChevronUp, Share2, Star, Home, ShieldCheck, Award, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import API_URL from '../config';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart, updateQuantity } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [pincode, setPincode] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [showNotifyForm, setShowNotifyForm] = useState(false);
    const [notifyForm, setNotifyForm] = useState({ name: '', email: '', phone: '' });
    const [submittingNotify, setSubmittingNotify] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState('description');

    // Zoom State
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Fetch product by slug
                const response = await axios.get(`${API_URL}/products/${slug}`);
                const productData = response.data;

                // Parse images if it's a string (JSON)
                if (typeof productData.images === 'string') {
                    productData.images = JSON.parse(productData.images);
                }

                setProduct(productData);
                setLoading(false);

                // Fetch related products
                fetchRelatedProducts(productData.category, productData.id);

            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Product not found");
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchRelatedProducts = async (category, currentId) => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            const related = response.data
                .filter(p => p.category === category && p.id !== currentId)
                .slice(0, 4)
                .map(p => ({
                    ...p,
                    image: p.image_url,
                    isNew: p.is_new,
                    isBestSeller: p.is_best_seller
                }));
            setRelatedProducts(related);
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    };

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

        // Mock Logic
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

    const handleNotifyMe = async (e) => {
        e.preventDefault();
        setSubmittingNotify(true);

        try {
            const authToken = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/stock-notifications`, {
                product_id: product.id,
                name: notifyForm.name || user?.name || '',
                email: notifyForm.email || user?.email || '',
                phone: notifyForm.phone || user?.phone || ''
            }, {
                headers: authToken ? { 'x-auth-token': authToken } : {}
            });

            if (response.status === 201) {
                alert('Thank you! We will notify you when this product is back in stock.');
                setShowNotifyForm(false);
                setNotifyForm({ name: '', email: '', phone: '' });
            }
        } catch (error) {
            console.error('Error submitting notification request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setSubmittingNotify(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out this ${product.name} on Arundhati Handlooms!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2)'
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)'
        });
    };

    const Accordion = ({ title, id, children }) => (
        <div className="border-b border-gray-200">
            <button
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
                onClick={() => setActiveAccordion(activeAccordion === id ? null : id)}
            >
                <span className="font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{title}</span>
                {activeAccordion === id ?
                    <ChevronUp size={20} className="text-gray-500" /> :
                    <ChevronDown size={20} className="text-gray-500" />
                }
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === id ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                <div className="text-gray-600 text-sm leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
    );

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg">Back to Shop</button>
            </div>
        );
    }

    // Product Schema
    const productSchema = product ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.image_url,
        "description": product.description,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "Arundhati Handlooms"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": product.discount_percent ? (product.price * (1 - product.discount_percent / 100)) : product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "category": product.category,
        "material": product.fabric_type
    } : null;

    return (
        <div className="bg-white min-h-screen pb-24 md:pb-12">
            {product && (
                <SEO
                    title={`${product.name} - Arundhati Handlooms`}
                    description={`${product.description || `Buy ${product.name} at Arundhati Handlooms`}. Premium ${product.fabric_type || 'handloom'} ${product.category}. Available in ${product.color}.`}
                    keywords={`${product.name}, ${product.category}, ${product.fabric_type}, handloom saree, ${product.color} saree`}
                    ogImage={product.image_url}
                    schema={productSchema}
                />
            )}

            {/* Breadcrumbs */}
            <div className="bg-gray-50 py-3 border-b border-gray-100">
                <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center">
                    <Link to="/" className="hover:text-[var(--color-primary)] flex items-center gap-1"><Home size={14} /> Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div
                            className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden relative group shadow-sm cursor-zoom-in"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                                style={zoomStyle}
                            />
                            {product.is_new && (
                                <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider z-10">
                                    New Arrival
                                </span>
                            )}
                            {product.discount_percent > 0 && (
                                <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider z-10">
                                    {product.discount_percent}% OFF
                                </span>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm uppercase block mb-2">
                                        {product.category}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                                        {product.name}
                                    </h1>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-50 rounded-full transition-colors"
                                    title="Share Product"
                                >
                                    <Share2 size={24} />
                                </button>
                            </div>

                            <div className="flex items-end gap-3 mb-6 border-b border-gray-100 pb-6">
                                {product.discount_percent > 0 ? (
                                    <>
                                        <p className="text-3xl font-bold text-[var(--color-primary)]">
                                            ₹{(product.price * (1 - product.discount_percent / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                        <p className="text-gray-400 text-xl line-through mb-1">
                                            ₹{Number(product.price).toLocaleString()}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-3xl font-bold text-[var(--color-primary)]">
                                        ₹{Number(product.price).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6">
                                {product.description}
                            </p>

                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-8">
                                    <span className="text-sm font-medium text-gray-900 block mb-3">Available Colors</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] shadow-sm cursor-default relative"
                                                style={{ backgroundColor: product.color ? product.color.toLowerCase() : '#ccc' }}
                                                title={product.color}
                                            >
                                                <div className="absolute inset-0 rounded-full border-2 border-white"></div>
                                            </div>
                                            <span className="text-xs text-[var(--color-primary)] font-medium">{product.color}</span>
                                        </div>

                                        {product.variants.map(variant => (
                                            <Link
                                                key={variant.id}
                                                to={`/product/${variant.slug}`}
                                                className="flex flex-col items-center gap-1 group"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full border border-gray-200 shadow-sm group-hover:border-gray-400 transition-colors"
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
                            <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                                    <MapPin size={16} className="text-[var(--color-primary)]" /> Check Delivery Availability
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={() => checkDelivery(pincode)}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                        disabled={checkingPincode}
                                    >
                                        {checkingPincode ? 'Checking...' : 'Check'}
                                    </button>
                                </div>
                                {deliveryDate && (
                                    <div className="mt-3 flex items-start gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-lg inline-block">
                                        <Truck size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>
                                            Estimated delivery by <strong>{deliveryDate}</strong>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden md:flex flex-col gap-4 mb-8">
                                {product.stock_quantity > 0 ? (
                                    <div className="flex gap-4">
                                        {quantity > 0 ? (
                                            <div className="flex items-center border-2 border-gray-200 rounded-full w-full max-w-[180px]">
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                    className="p-3 hover:bg-gray-50 text-gray-600 rounded-l-full transition-colors"
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    className="p-3 hover:bg-gray-50 text-gray-600 rounded-r-full transition-colors"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-1 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3.5 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
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
                                            className="flex-1 bg-[var(--color-primary)] text-white py-3.5 rounded-full font-bold hover:bg-[var(--color-accent)] transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                            <p className="text-red-600 font-bold">Out of Stock</p>
                                        </div>
                                        {!showNotifyForm ? (
                                            <button
                                                onClick={() => {
                                                    setShowNotifyForm(true);
                                                    if (user) {
                                                        setNotifyForm({
                                                            name: user.name || '',
                                                            email: user.email || '',
                                                            phone: user.phone || ''
                                                        });
                                                    }
                                                }}
                                                className="w-full bg-gray-800 text-white py-3.5 rounded-full font-medium hover:bg-gray-900 transition-colors"
                                            >
                                                Notify Me When Available
                                            </button>
                                        ) : (
                                            <form onSubmit={handleNotifyMe} className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Get notified when back in stock:</p>
                                                <input
                                                    type="text"
                                                    placeholder="Your Name"
                                                    value={notifyForm.name}
                                                    onChange={(e) => setNotifyForm({ ...notifyForm, name: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-md"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Your Email"
                                                    value={notifyForm.email}
                                                    onChange={(e) => setNotifyForm({ ...notifyForm, email: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-md"
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        type="submit"
                                                        disabled={submittingNotify}
                                                        className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-md hover:bg-[var(--color-accent)] disabled:opacity-50"
                                                    >
                                                        {submittingNotify ? 'Submitting...' : 'Submit'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNotifyForm(false)}
                                                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t border-b border-gray-100">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <Award className="text-[var(--color-primary)]" size={24} />
                                    <span className="text-xs font-medium text-gray-600">Authentic Handloom</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="text-[var(--color-primary)]" size={24} />
                                    <span className="text-xs font-medium text-gray-600">Quality Checked</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <RefreshCw className="text-[var(--color-primary)]" size={24} />
                                    <span className="text-xs font-medium text-gray-600">Easy Returns</span>
                                </div>
                            </div>

                            {/* Accordions */}
                            <div className="border-t border-gray-200">
                                <Accordion title="Product Description" id="description">
                                    {product.description}
                                </Accordion>
                                <Accordion title="Product Details" id="details">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Fabric</span>
                                            <span className="font-medium text-gray-900">{product.fabric_type || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Color</span>
                                            <span className="font-medium text-gray-900">{product.color || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Size</span>
                                            <span className="font-medium text-gray-900">{product.size || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">SKU</span>
                                            <span className="font-medium text-gray-900">{product.sku || 'N/A'}</span>
                                        </div>
                                    </div>
                                </Accordion>
                                <Accordion title="Shipping & Returns" id="shipping">
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <Truck className="text-[var(--color-primary)] flex-shrink-0" size={20} />
                                            <div>
                                                <p className="font-medium text-gray-900">Free Shipping</p>
                                                <p className="text-sm text-gray-500">On all orders across India. Dispatched within 24 hours.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <ArrowLeft className="text-[var(--color-primary)] flex-shrink-0" size={20} />
                                            <div>
                                                <p className="font-medium text-gray-900">Easy Returns</p>
                                                <p className="text-sm text-gray-500">7-day return policy. No questions asked.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-gray-100 pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Customer Reviews</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" className="text-gray-300" />
                            </div>
                            <span className="text-gray-600 font-medium">4.0/5 (Based on 12 reviews)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mock Reviews */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400 text-sm">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <span className="font-bold text-gray-900">Beautiful Saree!</span>
                            </div>
                            <p className="text-gray-600 mb-4">"The fabric quality is amazing and the color is exactly as shown in the picture. Loved the packaging too!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                                    AS
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Anjali S.</p>
                                    <p className="text-xs text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400 text-sm">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} className="text-gray-300" fill="currentColor" />
                                </div>
                                <span className="font-bold text-gray-900">Great Value</span>
                            </div>
                            <p className="text-gray-600 mb-4">"Very happy with the purchase. Delivery was quick and the saree looks very elegant."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                    MK
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Meera K.</p>
                                    <p className="text-xs text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-gray-100 pt-16">
                        <h2 className="text-3xl font-serif font-bold mb-8 text-center text-gray-900">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                {product.stock_quantity > 0 ? (
                    <div className="flex gap-3">
                        {quantity > 0 ? (
                            <div className="flex items-center border border-gray-300 rounded-lg w-32">
                                <button
                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                    className="p-3 hover:bg-gray-50 text-gray-600 flex-1 flex justify-center"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="font-bold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                    className="p-3 hover:bg-gray-50 text-gray-600 flex-1 flex justify-center"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={18} />
                                Add
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (quantity === 0) addToCart(product, 1);
                                navigate('/cart');
                            }}
                            className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold shadow-md"
                        >
                            Buy Now
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowNotifyForm(true)}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold"
                    >
                        Notify Me
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
