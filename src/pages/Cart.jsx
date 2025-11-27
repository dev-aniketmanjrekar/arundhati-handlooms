import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOrdering, setIsOrdering] = useState(false);

    const handlePlaceOrder = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!user.address || !user.pincode) {
            alert("Please update your address and pincode in your profile before placing an order.");
            navigate('/profile');
            return;
        }

        setIsOrdering(true);

        try {
            // 1. Save Order to Database
            const orderData = {
                items: cart,
                totalAmount: getCartTotal(),
                shippingAddress: user.address,
                shippingPincode: user.pincode
            };

            const response = await axios.post(`${API_URL}/orders`, orderData, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            const data = response.data;
            console.log("Order placed:", data);

            // 2. WhatsApp Integration
            const phoneNumber = "917021512319";
            let message = `Hello Arundhati Handlooms, I would like to place an order (Order ID: #${data.orderId}):\n\n`;

            cart.forEach((item, index) => {
                const price = item.discount_percent ? item.price * (1 - item.discount_percent / 100) : item.price;
                message += `${index + 1}. ${item.name} (${item.category}) - ${item.color}\n`;
                message += `   Qty: ${item.quantity} x ₹${price.toLocaleString(undefined, { maximumFractionDigits: 0 })} = ₹${(item.quantity * price).toLocaleString(undefined, { maximumFractionDigits: 0 })}\n\n`;
            });

            message += `Total Amount: ₹${getCartTotal().toLocaleString()}\n`;
            message += `Shipping to: ${user.address}, ${user.pincode}\n\n`;
            message += "Please confirm availability and payment details.";

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Clear cart
            clearCart();
            navigate('/');

        } catch (error) {
            console.error("Order error:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsOrdering(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[var(--color-bg)]">
                <div className="bg-white p-8 rounded-full mb-6 shadow-sm">
                    <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
                <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="py-12 bg-[var(--color-bg)] min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center">
                                <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-serif font-medium text-lg text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category} • {item.color}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            {item.discount_percent > 0 ? (
                                                <>
                                                    <p className="font-bold text-[var(--color-primary)]">
                                                        ₹{((item.price * (1 - item.discount_percent / 100)) * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </p>
                                                    <p className="text-xs text-gray-400 line-through">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="font-bold text-[var(--color-primary)]">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                            <h3 className="font-serif font-bold text-xl mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{getCartTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isOrdering}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isOrdering ? 'Processing...' : (
                                    <>Place Order via WhatsApp <ArrowRight size={20} /></>
                                )}
                            </button>

                            {!user && (
                                <p className="text-xs text-red-500 text-center mt-4">
                                    You need to login to place an order.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
