import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Bell, CheckCircle, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import API_URL from '../../config';
import { useSortableData } from '../../hooks/useSortableData';

const AdminStockNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, notified

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('token');
            const [notifRes, prodRes] = await Promise.all([
                fetch(`${API_URL}/admin/stock-notifications`, { headers: { 'x-auth-token': authToken } }),
                fetch(`${API_URL}/admin/products`, { headers: { 'x-auth-token': authToken } })
            ]);

            if (notifRes.ok) {
                const data = await notifRes.json();
                setNotifications(data);
            }
            if (prodRes.ok) {
                const data = await prodRes.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
                fetchData();
            }
        } catch (error) {
            console.error('Error marking notification:', error);
        }
    };

    // Filter Notifications
    const filteredNotifications = Array.isArray(notifications) ? notifications.filter(n => {
        if (filter === 'pending') return n.status === 'pending';
        if (filter === 'notified') return n.status === 'notified';
        return true;
    }) : [];

    // Low Stock Products (Stock <= 5)
    const lowStockProducts = Array.isArray(products) ? products.filter(p => p.stock_quantity <= 5) : [];

    // Sorting
    const { items: sortedNotifications, requestSort: requestSortNotif, sortConfig: sortConfigNotif } = useSortableData(filteredNotifications);
    const { items: sortedLowStock, requestSort: requestSortStock, sortConfig: sortConfigStock } = useSortableData(lowStockProducts);

    const SortIcon = ({ direction }) => {
        if (!direction) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
        return direction === 'ascending' ? <ArrowUp size={14} className="ml-1 text-gray-600" /> : <ArrowDown size={14} className="ml-1 text-gray-600" />;
    };

    const SortableHeader = ({ label, sortKey, currentSortConfig, onSort }) => (
        <th
            className="px-6 py-4 font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors select-none"
            onClick={() => onSort(sortKey)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon direction={currentSortConfig?.key === sortKey ? currentSortConfig.direction : null} />
            </div>
        </th>
    );

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Stock Management</h1>
                    <button
                        onClick={fetchData}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title="Refresh"
                    >
                        <Bell size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Low Stock Overview */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-red-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Low Stock Overview (≤ 5 items)</h2>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-red-50 border-b border-red-100">
                                <tr>
                                    <SortableHeader label="Product Name" sortKey="name" currentSortConfig={sortConfigStock} onSort={requestSortStock} />
                                    <SortableHeader label="SKU" sortKey="sku" currentSortConfig={sortConfigStock} onSort={requestSortStock} />
                                    <SortableHeader label="Category" sortKey="category" currentSortConfig={sortConfigStock} onSort={requestSortStock} />
                                    <SortableHeader label="Stock" sortKey="stock_quantity" currentSortConfig={sortConfigStock} onSort={requestSortStock} />
                                    <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedLowStock.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No low stock items found. Good job!</td></tr>
                                ) : sortedLowStock.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.sku || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                        <td className="px-6 py-4 font-bold text-red-600">{product.stock_quantity}</td>
                                        <td className="px-6 py-4">
                                            {product.stock_quantity === 0 ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Out of Stock</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Low Stock</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Customer Notifications */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Customer Requests</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${filter === 'pending' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('notified')}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${filter === 'notified' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Notified
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <SortableHeader label="Product" sortKey="product_name" currentSortConfig={sortConfigNotif} onSort={requestSortNotif} />
                                    <SortableHeader label="Customer" sortKey="user_name" currentSortConfig={sortConfigNotif} onSort={requestSortNotif} />
                                    <SortableHeader label="Contact" sortKey="user_email" currentSortConfig={sortConfigNotif} onSort={requestSortNotif} />
                                    <SortableHeader label="Requested" sortKey="created_at" currentSortConfig={sortConfigNotif} onSort={requestSortNotif} />
                                    <SortableHeader label="Status" sortKey="status" currentSortConfig={sortConfigNotif} onSort={requestSortNotif} />
                                    <th className="px-6 py-4 font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : sortedNotifications.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No requests found.</td></tr>
                                ) : sortedNotifications.map((notification) => (
                                    <tr key={notification.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{notification.product_name || `Product #${notification.product_id}`}</td>
                                        <td className="px-6 py-4 text-gray-600">{notification.user_name || 'Guest'}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="text-sm">{notification.user_email}</div>
                                            <div className="text-xs text-gray-400">{notification.user_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {notification.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {notification.status === 'pending' && (
                                                <button
                                                    onClick={() => markAsNotified(notification.id)}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
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
            </div>
        </AdminLayout>
    );
};

export default AdminStockNotifications;
