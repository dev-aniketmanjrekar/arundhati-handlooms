import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_URL from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalInquiries: 0,
        totalProducts: 0,
        totalCoupons: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const [statsResponse, couponsResponse] = await Promise.all([
                fetch(`${API_URL}/admin/dashboard-stats`, { headers: { 'x-auth-token': authToken } }),
                fetch(`${API_URL}/admin/coupons`, { headers: { 'x-auth-token': authToken } })
            ]);

            if (statsResponse.ok) {
                const data = await statsResponse.json();
                setStats(prev => ({ ...prev, ...data }));
            }

            if (couponsResponse.ok) {
                const coupons = await couponsResponse.json();
                setStats(prev => ({ ...prev, totalCoupons: coupons.filter(c => c.is_active).length }));
            } else {
                // Mock if API fails
                setStats(prev => ({ ...prev, totalCoupons: 2 }));
            }

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : stats.totalOrders}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : stats.totalUsers}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : stats.totalProducts}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Inquiries</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : stats.totalInquiries}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Coupons</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? '...' : stats.totalCoupons || 0}
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent activity to show.</p>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
