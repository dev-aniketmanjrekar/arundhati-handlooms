import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_URL from '../../config';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/inquiries`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setInquiries(data);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Inquiries</h1>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{inquiry.name}</h3>
                                <p className="text-sm text-gray-500">{inquiry.email} • {inquiry.phone}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(inquiry.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2">
                                Type: {inquiry.inquiry_type}
                            </span>
                            {inquiry.product_interest && (
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                    Interest: {inquiry.product_interest}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                            {inquiry.message}
                        </p>

                        {inquiry.custom_product_details && (
                            <div className="mt-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-1">Custom Details:</h4>
                                <p className="text-sm text-gray-600">{inquiry.custom_product_details}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminInquiries;
