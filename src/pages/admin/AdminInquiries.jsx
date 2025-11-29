import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_URL from '../../config';
import { useSortableData } from '../../hooks/useSortableData';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/inquiries/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': authToken }
            });

            if (response.ok) {
                fetchInquiries();
            }
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        }
    };

    // Sorting
    const { items: sortedInquiries, requestSort, sortConfig } = useSortableData(inquiries);

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
                <h1 className="text-3xl font-serif font-bold text-gray-900">Inquiries</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <SortableHeader label="Name" sortKey="name" />
                                <SortableHeader label="Email" sortKey="email" />
                                <SortableHeader label="Phone" sortKey="phone" />
                                <SortableHeader label="Type" sortKey="inquiry_type" />
                                <SortableHeader label="Message" sortKey="message" />
                                <SortableHeader label="Date" sortKey="created_at" />
                                <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : sortedInquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{inquiry.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{inquiry.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{inquiry.phone || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {inquiry.inquiry_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={inquiry.message}>
                                        {inquiry.message}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(inquiry.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(inquiry.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete Inquiry"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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

export default AdminInquiries;
