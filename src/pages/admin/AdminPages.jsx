import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { Edit, Eye, FileText } from 'lucide-react';

const AdminPages = () => {
    const pages = [
        { id: 'home', name: 'Home Page', path: '/', lastUpdated: '2023-11-20' },
        { id: 'about', name: 'About Us', path: '/about', lastUpdated: '2023-10-15' },
        { id: 'privacy', name: 'Privacy Policy', path: '/privacy', lastUpdated: '2023-09-01' },
        { id: 'shipping', name: 'Shipping Policy', path: '/shipping-policy', lastUpdated: '2023-09-01' },
        { id: 'returns', name: 'Returns & Exchange', path: '/returns', lastUpdated: '2023-09-01' },
        { id: 'contact', name: 'Contact Us', path: '/contact', lastUpdated: '2023-10-01' },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Pages</h1>
                    <p className="text-gray-500 text-sm mt-1">Edit content for your main website pages</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Page Name</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Path</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Last Updated</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-medium text-gray-900">{page.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{page.path}</code>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{page.lastUpdated}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/admin/pages/edit/${page.id}`}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <Edit size={16} /> Edit
                                        </Link>
                                        <a
                                            href={page.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                                        >
                                            <Eye size={16} /> View
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminPages;
