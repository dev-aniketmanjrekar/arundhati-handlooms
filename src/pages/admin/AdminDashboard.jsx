import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_URL from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingInquiries: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/stats`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
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
                    <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.activeUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Inquiries</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.pendingInquiries}</p>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-500">Real-time activity tracking coming soon.</p>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
