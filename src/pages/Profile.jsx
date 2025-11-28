import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const Profile = () => {
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                pincode: user.pincode || ''
            });
        }
    }, [user]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const authToken = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/auth/profile`, formData, {
                headers: { 'x-auth-token': authToken }
            });

            if (response.data.user) {
                setUser(response.data.user);
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            pincode: user.pincode || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-serif font-bold mb-8">My Profile</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[var(--color-primary)] px-6 py-8 text-white flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <User size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="opacity-90">Member since {new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                                    title="Edit Profile"
                                >
                                    <Edit2 size={20} />
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <User size={16} /> Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900">{user.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900">{user.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone size={16} /> Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Pincode</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        maxLength={6}
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900">{user.pincode || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin size={16} /> Delivery Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        rows="3"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900">{user.address || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        {/* Save/Cancel Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-accent)] disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
