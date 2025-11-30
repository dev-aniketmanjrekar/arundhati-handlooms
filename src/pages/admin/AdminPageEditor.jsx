import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';

const AdminPageEditor = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Mock initial data based on pageId
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        aboutText: '',
        metaTitle: '',
        metaDescription: ''
    });

    useEffect(() => {
        // Simulate fetching data
        const loadData = () => {
            // In a real app, fetch from API based on pageId
            const mockData = {
                home: {
                    heroTitle: 'Weaving Tradition Into Elegance',
                    heroSubtitle: 'Discover the finest collection of authentic handwoven sarees and blouses.',
                    heroImage: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
                    metaTitle: 'Arundhati Handlooms - Home',
                    metaDescription: 'Premium handloom sarees.'
                },
                about: {
                    heroTitle: 'Our Story',
                    heroSubtitle: 'A legacy of 50 years in handloom weaving.',
                    heroImage: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9',
                    aboutText: 'Arundhati Handlooms started in 1970...',
                    metaTitle: 'About Us - Arundhati Handlooms',
                    metaDescription: 'Learn about our heritage.'
                }
            };

            if (mockData[pageId]) {
                setContent(mockData[pageId]);
            }
        };

        loadData();
    }, [pageId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('✅ Content updated successfully!');
        }, 1000);
    };

    return (
        <AdminLayout>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/pages')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 capitalize">Edit {pageId} Page</h1>
                    <p className="text-gray-500 text-sm mt-1">Update content and SEO settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-blue-600" />
                            Hero Section
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                                <input
                                    type="text"
                                    name="heroTitle"
                                    value={content.heroTitle}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                                <textarea
                                    name="heroSubtitle"
                                    value={content.heroSubtitle}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="heroImage"
                                        value={content.heroImage}
                                        onChange={handleChange}
                                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                                        <Upload size={18} />
                                    </button>
                                </div>
                                {content.heroImage && (
                                    <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border">
                                        <img src={content.heroImage} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {pageId === 'about' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4">About Content</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Main Text</label>
                                <textarea
                                    name="aboutText"
                                    value={content.aboutText}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-bold mb-4">Publishing</h2>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={content.metaTitle}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    name="metaDescription"
                                    value={content.metaDescription}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={20} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPageEditor;
