import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Saree',
        productInterest: '',
        customProductDetails: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Save to Database
            await axios.post(`${API_URL}/inquiries`, formData);

            // 2. WhatsApp Redirect
            const phoneNumber = "917021512319";
            let whatsappMsg = `*New Inquiry from ${formData.name}*\n\n`;
            whatsappMsg += `Type: ${formData.inquiryType}\n`;
            whatsappMsg += `Product: ${formData.productInterest === 'Other' ? formData.customProductDetails : formData.productInterest}\n`;
            whatsappMsg += `Message: ${formData.message}\n\n`;
            whatsappMsg += `Contact: ${formData.phone} | ${formData.email}`;

            const encodedMessage = encodeURIComponent(whatsappMsg);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

            alert('Inquiry submitted successfully!');
            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                inquiryType: 'Saree',
                productInterest: '',
                customProductDetails: '',
                message: ''
            });

        } catch (error) {
            console.error(error);
            alert('Failed to submit inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have a question about our handloom sarees? Want to customize a blouse?
                        Fill out the form below and we'll get back to you instantly via WhatsApp.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h3 className="text-xl font-serif font-bold mb-6">Get in Touch</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--color-bg)] p-3 rounded-full text-[var(--color-primary)]">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Visit Our Store</h4>
                                        <p className="text-gray-600 mt-1">Dadar, Ranade Road,<br />Mumbai - 400028</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--color-bg)] p-3 rounded-full text-[var(--color-primary)]">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Call Us</h4>
                                        <p className="text-gray-600 mt-1">
                                            <a href="tel:+917021512319" className="hover:text-[var(--color-primary)]">+91 7021512319</a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--color-bg)] p-3 rounded-full text-[var(--color-primary)]">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Email Us</h4>
                                        <p className="text-gray-600 mt-1">
                                            <a href="mailto:orders@arundhatihandlooms.com" className="hover:text-[var(--color-primary)]">orders@arundhatihandlooms.com</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-sm">
                            <h3 className="text-xl font-serif font-bold mb-4">Weaving Stories</h3>
                            <p className="opacity-90 leading-relaxed">
                                "Every thread tells a story, every weave is a legacy."
                                <br /><br />
                                At Arundhati Handlooms, we are committed to preserving the ancient art of Indian weaving. Your support helps sustain the livelihoods of our master weavers.
                            </p>
                        </div>
                    </div>

                    {/* Inquiry Form */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h3 className="text-xl font-serif font-bold mb-6">Send an Inquiry</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type</label>
                                    <select
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    >
                                        <option value="Saree">Saree</option>
                                        <option value="Blouse">Blouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Interest</label>
                                    <select
                                        name="productInterest"
                                        value={formData.productInterest}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    >
                                        <option value="">Select a Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.name}>{p.name}</option>
                                        ))}
                                        <option value="Other">Other (Specify below)</option>
                                    </select>
                                </div>
                            </div>

                            {formData.productInterest === 'Other' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specify Product</label>
                                    <input
                                        type="text"
                                        name="customProductDetails"
                                        value={formData.customProductDetails}
                                        onChange={handleChange}
                                        placeholder="e.g. Custom Silk Saree in Blue"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        <MessageCircle size={20} /> Send via WhatsApp
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
