import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Bell, CheckCircle } from 'lucide-react';
import API_URL from '../../config';

const AdminStockNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, notified

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/stock-notifications`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching stock notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsNotified = async (id) => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/stock-notifications/${id}/notify`, {
                method: 'PUT',
                headers: { 'x-auth-token': authToken }
            });

            if (response.ok) {
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking notification:', error);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'pending') return n.status === 'pending';
        if (filter === 'notified') return n.status === 'notified';
        return true;
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Stock Notifications</h1>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-red-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending'
                            ? 'bg-red-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pending ({notifications.filter(n => n.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('notified')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'notified'
                            ? 'bg-red-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Notified ({notifications.filter(n => n.status === 'notified').length})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Product</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Contact</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Requested</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : filteredNotifications.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No notifications found</td></tr>
                            ) : filteredNotifications.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {notification.image_url && (
                                                <img
                                                    src={notification.image_url}
                                                    alt={notification.product_name}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{notification.product_name}</div>
                                                <div className="text-sm text-gray-500">Stock: {notification.current_stock}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{notification.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm text-gray-600">{notification.email}</div>
                                            {notification.phone && (
                                                <div className="text-xs text-gray-500">{notification.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {notification.status === 'pending' ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Notified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {notification.status === 'pending' && (
                                            <button
                                                onClick={() => markAsNotified(notification.id)}
                                                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                <CheckCircle size={16} />
                                                Mark Notified
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminStockNotifications;
