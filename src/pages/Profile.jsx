import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut, Edit2, Save, X, Key, Package, ChevronRight, Shield } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import axios from 'axios';
import API_URL from '../config';

const Profile = () => {
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saving, setSaving] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const authToken = localStorage.getItem('token');
            await axios.put(`${API_URL}/auth/change-password`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { 'x-auth-token': authToken }
            });

            setPasswordSuccess('Password updated successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordChange(false);
                setPasswordSuccess('');
            }, 2000);
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-500 mt-1">Manage your profile and view your orders</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start md:self-auto"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Quick Actions */}
                    <div className="space-y-6">
                        {/* User Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-2xl font-serif">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-gray-900">{user.name}</h2>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Member Since</span>
                                    <span className="font-medium">{new Date(user.created_at || Date.now()).getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Cards */}
                        <Link to="/my-orders" className="block group">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-[var(--color-primary)] transition-all duration-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">My Orders</h3>
                                        <p className="text-sm text-gray-500">Track and view past orders</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-[var(--color-primary)]" />
                            </div>
                        </Link>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Security</h3>
                                    <p className="text-sm text-gray-500">Password and account security</p>
                                </div>
                            </div>

                            {!showPasswordChange ? (
                                <button
                                    onClick={() => setShowPasswordChange(true)}
                                    className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Change Password
                                </button>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="space-y-3 mt-4">
                                    {passwordError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{passwordError}</div>}
                                    {passwordSuccess && <div className="text-xs text-green-600 bg-green-50 p-2 rounded">{passwordSuccess}</div>}

                                    <PasswordInput
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Current Password"
                                        className="text-sm"
                                    />
                                    <PasswordInput
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="New Password"
                                        className="text-sm"
                                    />
                                    <PasswordInput
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm New Password"
                                        className="text-sm"
                                    />

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:bg-[var(--color-accent)]"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordChange(false);
                                                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                                setPasswordError('');
                                            }}
                                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="font-bold text-lg text-gray-900">Profile Details</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium text-sm"
                                    >
                                        <Edit2 size={16} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="p-6">
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{user.name}</p>
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{user.email}</p>
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                                placeholder="Add phone number"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{user.phone || <span className="text-gray-400 italic">Not provided</span>}</p>
                                        )}
                                    </div>

                                    {/* Pincode */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <MapPin size={16} /> Pincode
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                                maxLength={6}
                                                placeholder="Add pincode"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{user.pincode || <span className="text-gray-400 italic">Not provided</span>}</p>
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                                rows="3"
                                                placeholder="Add delivery address"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium leading-relaxed">{user.address || <span className="text-gray-400 italic">Not provided</span>}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Save/Cancel Buttons */}
                                {isEditing && (
                                    <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-accent)] disabled:opacity-50 transition-colors font-medium"
                                        >
                                            <Save size={18} />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
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
            </div>
        </div>
    );
};

export default Profile;
