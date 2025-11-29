import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Calendar, CreditCard, MapPin } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const MyOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/orders/my-orders`, {
                headers: { 'x-auth-token': authToken }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
                        <Link
                            to="/collections/all"
                            className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-md hover:bg-[var(--color-accent)] transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 border-b px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-bold text-gray-900">#{order.id}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-xl font-bold text-[var(--color-primary)]">
                                            ₹{order.total_amount?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 py-4 border-b last:border-b-0">
                                            <img
                                                src={item.image_url}
                                                alt={item.product_name}
                                                className="w-20 h-28 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                                {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                                                {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500">₹{item.price} each</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Shipping Address */}
                                    {order.shipping_address && (
                                        <div className="mt-4 pt-4 border-t">
                                            <div className="flex items-start gap-2">
                                                <MapPin size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Shipping Address</p>
                                                    <p className="text-sm text-gray-600">{order.shipping_address.name}</p>
                                                    <p className="text-sm text-gray-600">{order.shipping_address.address}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.shipping_address.pincode} • {order.shipping_address.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
