import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, RefreshCcw, Truck, Gift, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const FREE_SHIPPING_THRESHOLD = 5000;

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
    if (!item) return null;

    const price = item.discount_percent ? item.price * (1 - item.discount_percent / 100) : item.price;
    const originalPrice = item.price || 0;
    const finalPrice = price || 0;
    const quantity = item.quantity || 1;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-all hover:shadow-md">
            <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <img src={item.image_url || item.image || 'https://via.placeholder.com/150'} alt={item.name || 'Product'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <Link to={`/product/${item.slug}`}>
                            <h3 className="font-serif font-medium text-lg text-gray-900 hover:text-[var(--color-primary)] transition-colors">
                                {item.name || 'Unknown Product'}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{item.category} • {item.color} • {item.size || 'Free Size'}</p>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        title="Remove Item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 transition-colors rounded-l-lg"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className="w-10 text-center font-medium text-sm text-gray-900">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 transition-colors rounded-r-lg"
                        >
                            +
                        </button>
                    </div>
                    <div className="text-right">
                        {item.discount_percent > 0 ? (
                            <>
                                <p className="font-bold text-lg text-[var(--color-primary)]">
                                    ₹{(finalPrice * quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-xs text-gray-400 line-through">
                                    ₹{(originalPrice * quantity).toLocaleString()}
                                </p>
                            </>
                        ) : (
                            <p className="font-bold text-lg text-[var(--color-primary)]">
                                ₹{(finalPrice * quantity).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (response.ok) {
                    const data = await response.json();
                    // Filter out items already in cart and pick 4 random ones
                    const cartIds = new Set(cart.map(item => item.id));
                    const available = data.filter(p => !cartIds.has(p.id));
                    const shuffled = available.sort(() => 0.5 - Math.random());
                    setRelatedProducts(shuffled.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
    }, [cart]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[var(--color-bg)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-bg)] px-4">
                <div className="bg-white p-8 rounded-full mb-6 shadow-sm">
                    <ShoppingBag size={64} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-3 text-gray-900">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added any items yet. Explore our collection of authentic handlooms.
                </p>
                <Link to="/shop" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-primary-dark)] transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    Start Shopping <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12 bg-[#f8f9fa] min-h-screen">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-gray-900">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Free Shipping Progress */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <Truck className="text-[var(--color-primary)]" size={24} />
                                <h3 className="font-medium text-gray-900">
                                    {remainingForFreeShipping > 0
                                        ? `Add ₹${remainingForFreeShipping.toLocaleString()} more for Free Shipping`
                                        : "You've unlocked Free Shipping!"}
                                </h3>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-[var(--color-primary)] h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            {cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeFromCart={removeFromCart}
                                />
                            ))}
                        </div>

                        {/* Order Note */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Gift size={18} className="text-gray-500" /> Order Instructions
                            </h3>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                placeholder="Add special instructions for your order (e.g., gift wrap, delivery notes)..."
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[100px] text-sm"
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-serif font-bold text-xl mb-6 text-gray-900">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    {remainingForFreeShipping <= 0 ? (
                                        <span className="text-green-600 font-medium">Free</span>
                                    ) : (
                                        <span className="text-gray-900">₹150</span>
                                    )}
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>₹{(cartTotal + (remainingForFreeShipping <= 0 ? 0 : 150)).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowCouponInput(!showCouponInput)}
                                    className="text-[var(--color-primary)] text-sm font-medium flex items-center gap-1 hover:underline mb-2"
                                >
                                    <Tag size={16} /> Have a coupon code?
                                </button>
                                {showCouponInput && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                        />
                                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isOrdering}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isOrdering ? 'Processing...' : (
                                    <>Checkout via WhatsApp <ArrowRight size={20} /></>
                                )}
                            </button>

                            {!user && (
                                <p className="text-xs text-red-500 text-center mt-3 bg-red-50 py-2 rounded-lg">
                                    Please login to place an order.
                                </p>
                            )}

                            {/* Trust Badges */}
                            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="bg-gray-50 p-3 rounded-full">
                                        <ShieldCheck size={24} className="text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="bg-gray-50 p-3 rounded-full">
                                        <RefreshCcw size={24} className="text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(product => (
                                <Link key={product.id} to={`/product/${product.slug}`} className="group">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 truncate group-hover:text-[var(--color-primary)] transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[var(--color-primary)]">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
