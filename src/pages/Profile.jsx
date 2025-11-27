import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
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
                        <button
                            onClick={handleLogout}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </label>
                                <p className="text-lg text-gray-900">{user.email}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <p className="text-lg text-gray-900">{user.phone}</p>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin size={16} /> Delivery Address
                                </label>
                                <p className="text-lg text-gray-900">{user.address}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Pincode</label>
                                <p className="text-lg text-gray-900">{user.pincode}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
