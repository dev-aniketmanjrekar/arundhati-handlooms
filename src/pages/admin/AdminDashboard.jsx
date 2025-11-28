import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards - Placeholders for now */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹4,52,000</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">1,203</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Inquiries</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
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
