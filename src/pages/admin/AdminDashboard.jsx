import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingInquiries: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const { token } = useAuth(); // Assuming useAuth exposes token, if not we get it from localStorage

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const authToken = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/admin/stats`, {
                    headers: { 'x-auth-token': authToken }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Inquiries</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingInquiries}</p>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                {stats.recentActivity.length > 0 ? (
                    <ul className="space-y-3">
                        {stats.recentActivity.map((activity, index) => (
                            <li key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <span>New Order #{activity.id}</span>
                                <span className="text-gray-500 text-sm">{new Date(activity.created_at).toLocaleDateString()}</span>
                                <span className="font-medium">₹{activity.value}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recent activity to show.</p>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
