import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, ArrowLeft, Upload, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

const AdminPageEditor = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Mock initial data based on pageId
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        heroImageMobile: '',
        featuredTitle: '',
        featuredSubtitle: '',
        featuredDescription: '',
        featuredImage: '',
        occasion1Title: '', occasion1Image: '', occasion1Desc: '',
        occasion2Title: '', occasion2Image: '', occasion2Desc: '',
        occasion3Title: '', occasion3Image: '', occasion3Desc: '',
        heritageTitle: '',
        heritageDescription: '',
        heritageImage: '',
        aboutText: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    });

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const res = await axios.get(`${API_URL}/pages/${pageId}`);
                if (res.data && res.data.content) {
                    // Merge fetched content with default structure to prevent undefined errors
                    // Also merge with default values to ensure existing site content shows up if DB is empty
                    const defaultHomeContent = {
                        heroTitle: 'Weaving Tradition Into Elegance',
                        heroSubtitle: 'Discover the finest collection of authentic handwoven sarees and blouses.',
                        heroImage: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
                        heroImageMobile: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
                        featuredTitle: 'The Royal Banarasi Edit',
                        featuredSubtitle: 'Exclusive Launch',
                        featuredDescription: 'Experience the grandeur of Varanasi with our handpicked collection of pure Katan Silk Banarasi sarees. Intricate zari work meets timeless elegance.',
                        featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop',
                        occasion1Title: 'Wedding',
                        occasion1Image: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9?q=80&w=800&auto=format&fit=crop',
                        occasion1Desc: 'Bridal & Trousseau',
                        occasion2Title: 'Festive',
                        occasion2Image: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147?q=80&w=800&auto=format&fit=crop',
                        occasion2Desc: 'Celebrations & Parties',
                        occasion3Title: 'Work Wear',
                        occasion3Image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop',
                        occasion3Desc: 'Elegant & Professional',
                        heritageTitle: 'The Art of Timeless Weaving',
                        heritageDescription: "Every thread tells a story. Our sarees are not just garments; they are a legacy woven by skilled artisans who have inherited this craft through generations.",
                        heritageImage: '/images/kalamkari-red.png'
                    };

                    let dbContent = res.data.content || {};
                    if (typeof dbContent === 'string') {
                        try {
                            dbContent = JSON.parse(dbContent);
                        } catch (e) {
                            console.error('Error parsing JSON content:', e);
                            dbContent = {};
                        }
                    }
                    const mergedContent = {
                        ...(pageId === 'home' ? defaultHomeContent : {})
                    };

                    // Only overwrite with DB content if it's not "empty" (null, undefined, or empty string)
                    // This ensures defaults are preserved if the DB has empty placeholders
                    Object.keys(dbContent).forEach(key => {
                        const val = dbContent[key];
                        const isEmpty = val === null || val === undefined || (typeof val === 'string' && val.trim() === '');

                        // If DB value is NOT empty, OR if there is no default value for this key (so we accept the empty DB value), use the DB value.
                        if (!isEmpty || !defaultHomeContent[key]) {
                            mergedContent[key] = val;
                        }
                    });

                    setContent(mergedContent);
                }
            } catch (error) {
                console.error('Error fetching page data:', error);
                // Fallback to mock data if API fails (or for first time load)
                const mockData = {
                    home: {
                        heroTitle: 'Weaving Tradition Into Elegance',
                        heroSubtitle: 'Discover the finest collection of authentic handwoven sarees and blouses.',
                        heroImage: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
                        heroImageMobile: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
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
            }
        };

        fetchPageData();
    }, [pageId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');

        if (!authToken) {
            alert('❌ You are not logged in. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            await axios.put(`${API_URL}/pages/${pageId}`, {
                title: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page`, // Simple title generation
                content: content
            }, {
                headers: { 'x-auth-token': authToken }
            });
            alert('✅ Content updated successfully!');
        } catch (error) {
            console.error('Error saving page content:', error);
            alert('❌ Failed to update content.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <AdminLayout>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4" onClick={() => setPreviewImage(null)}>
                    <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
                        <X size={32} />
                    </button>
                    <img
                        src={previewImage}
                        alt="Full Preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

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

                                </div>
                                {content.heroImage && (
                                    <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border bg-gray-50 group cursor-pointer" onClick={() => setPreviewImage(content.heroImage)}>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Click to Preview</span>
                                        </div>
                                        <img
                                            src={content.heroImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                            onLoad={(e) => e.target.style.display = 'block'}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL (Mobile)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="heroImageMobile"
                                        value={content.heroImageMobile || ''}
                                        onChange={handleChange}
                                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Optional - defaults to desktop image if empty"
                                    />

                                </div>
                                {content.heroImageMobile && (
                                    <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border bg-gray-50 group cursor-pointer" onClick={() => setPreviewImage(content.heroImageMobile)}>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Click to Preview</span>
                                        </div>
                                        <img
                                            src={content.heroImageMobile}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                            onLoad={(e) => e.target.style.display = 'block'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Featured Collection Section */}
                    {pageId === 'home' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-purple-600" />
                                Exclusive Launch Section
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="featuredTitle"
                                        value={content.featuredTitle || ''}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (e.g., Exclusive Launch)</label>
                                    <input
                                        type="text"
                                        name="featuredSubtitle"
                                        value={content.featuredSubtitle || ''}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="featuredDescription"
                                        value={content.featuredDescription || ''}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="featuredImage"
                                            value={content.featuredImage || ''}
                                            onChange={handleChange}
                                            className="flex-1 border rounded-lg px-4 py-2"
                                        />

                                    </div>
                                    {content.featuredImage && (
                                        <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border bg-gray-50 group cursor-pointer" onClick={() => setPreviewImage(content.featuredImage)}>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Click to Preview</span>
                                            </div>
                                            <img
                                                src={content.featuredImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.style.display = 'none'}
                                                onLoad={(e) => e.target.style.display = 'block'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Shop by Occasion Section */}
                    {pageId === 'home' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-pink-600" />
                                Shop by Occasion
                            </h2>
                            <div className="space-y-6">
                                {[1, 2, 3].map(num => (
                                    <div key={num} className="p-4 border rounded-lg bg-gray-50">
                                        <h3 className="font-medium mb-3 text-gray-900">Occasion {num}</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    name={`occasion${num}Title`}
                                                    value={content[`occasion${num}Title`] || ''}
                                                    onChange={handleChange}
                                                    className="w-full border rounded px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                <input
                                                    type="text"
                                                    name={`occasion${num}Desc`}
                                                    value={content[`occasion${num}Desc`] || ''}
                                                    onChange={handleChange}
                                                    className="w-full border rounded px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        name={`occasion${num}Image`}
                                                        value={content[`occasion${num}Image`] || ''}
                                                        onChange={handleChange}
                                                        className="flex-1 border rounded px-3 py-2 text-sm"
                                                    />

                                                </div>
                                                {content[`occasion${num}Image`] && (
                                                    <div className="mt-2 relative h-24 w-full rounded overflow-hidden border bg-white group cursor-pointer" onClick={() => setPreviewImage(content[`occasion${num}Image`])}>
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                            <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Preview</span>
                                                        </div>
                                                        <img
                                                            src={content[`occasion${num}Image`]}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => e.target.style.display = 'none'}
                                                            onLoad={(e) => e.target.style.display = 'block'}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Heritage Section */}
                    {pageId === 'home' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-orange-600" />
                                Heritage Section
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="heritageTitle"
                                        value={content.heritageTitle || ''}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="heritageDescription"
                                        value={content.heritageDescription || ''}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="heritageImage"
                                            value={content.heritageImage || ''}
                                            onChange={handleChange}
                                            className="flex-1 border rounded-lg px-4 py-2"
                                        />

                                    </div>
                                    {content.heritageImage && (
                                        <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border bg-gray-50 group cursor-pointer" onClick={() => setPreviewImage(content.heritageImage)}>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Click to Preview</span>
                                            </div>
                                            <img
                                                src={content.heritageImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.style.display = 'none'}
                                                onLoad={(e) => e.target.style.display = 'block'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                                <textarea
                                    name="metaKeywords"
                                    value={content.metaKeywords || ''}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="sarees, handloom, silk..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    name="metaDescription"
                                    value={content.metaDescription || ''}
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
            </div >
        </AdminLayout >
    );
};

export default AdminPageEditor;
