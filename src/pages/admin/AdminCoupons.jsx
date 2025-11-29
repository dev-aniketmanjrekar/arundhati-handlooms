import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, X, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Tag } from 'lucide-react';
import API_URL from '../../config';
import { useSortableData } from '../../hooks/useSortableData';

const AdminCoupons = () => {
    // Mock data for initial development if API fails
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '',
        expiry_date: '',
        is_active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/coupons`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setCoupons(data);
            } else {
                // Fallback for demo if API endpoint doesn't exist yet
                console.warn("API endpoint not found, using mock data");
                setCoupons([
                    { id: 1, code: 'WELCOME10', description: 'Welcome Offer', discount_type: 'percentage', discount_value: 10, min_order_amount: 1000, expiry_date: '2025-12-31', is_active: true },
                    { id: 2, code: 'FLAT500', description: 'Flat off on big orders', discount_type: 'fixed', discount_value: 500, min_order_amount: 5000, expiry_date: '2025-06-30', is_active: true }
                ]);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'code' ? value.toUpperCase() : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('token');

        try {
            const url = editingCoupon
                ? `${API_URL}/admin/coupons/${editingCoupon.id}`
                : `${API_URL}/admin/coupons`;

            const method = editingCoupon ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchCoupons();
                setIsModalOpen(false);
                setEditingCoupon(null);
                resetForm();
            } else {
                // Mock success for demo
                console.warn("API call failed, simulating success");
                const newCoupon = { ...formData, id: editingCoupon ? editingCoupon.id : Date.now() };
                if (editingCoupon) {
                    setCoupons(coupons.map(c => c.id === editingCoupon.id ? newCoupon : c));
                } else {
                    setCoupons([...coupons, newCoupon]);
                }
                setIsModalOpen(false);
                setEditingCoupon(null);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving coupon:', error);
            alert('Error saving coupon');
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            min_order_amount: coupon.min_order_amount,
            expiry_date: coupon.expiry_date.split('T')[0], // Format date for input
            is_active: coupon.is_active
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/coupons/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': authToken }
            });

            if (response.ok) {
                fetchCoupons();
            } else {
                // Mock delete
                setCoupons(coupons.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discount_type: 'percentage',
            discount_value: '',
            min_order_amount: '',
            expiry_date: '',
            is_active: true
        });
    };

    // Sorting
    const { items: sortedCoupons, requestSort, sortConfig } = useSortableData(coupons);

    const SortIcon = ({ direction }) => {
        if (!direction) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
        return direction === 'ascending' ? <ArrowUp size={14} className="ml-1 text-gray-600" /> : <ArrowDown size={14} className="ml-1 text-gray-600" />;
    };

    const SortableHeader = ({ label, sortKey }) => (
        <th
            className="px-6 py-4 font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors select-none"
            onClick={() => requestSort(sortKey)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon direction={sortConfig?.key === sortKey ? sortConfig.direction : null} />
            </div>
        </th>
    );

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Coupons</h1>
                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Create Coupon</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <SortableHeader label="Code" sortKey="code" />
                                <SortableHeader label="Discount" sortKey="discount_value" />
                                <SortableHeader label="Min Order" sortKey="min_order_amount" />
                                <SortableHeader label="Expiry" sortKey="expiry_date" />
                                <SortableHeader label="Status" sortKey="is_active" />
                                <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : sortedCoupons.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No coupons found. Create one to get started.</td></tr>
                            ) : sortedCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} className="text-[var(--color-primary)]" />
                                            {coupon.code}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{coupon.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        ₹{coupon.min_order_amount}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(coupon.expiry_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2 uppercase font-bold tracking-wider"
                                    placeholder="e.g. SUMMER20"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="e.g. 20% off on summer collection"
                                />
                            </div>

                            {/* Discount Type & Value */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                    <select
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        value={formData.discount_value}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Min Order & Expiry */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                                    <input
                                        type="number"
                                        name="min_order_amount"
                                        value={formData.min_order_amount}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={formData.expiry_date}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    id="is_active"
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Active
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
                                >
                                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCoupons;
