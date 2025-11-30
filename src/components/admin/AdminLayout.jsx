import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Users, MessageSquare, LogOut, Package, Bell, Tag, FileText } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
        { path: '/admin/orders', icon: Package, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
        { path: '/admin/stock-notifications', icon: Bell, label: 'Stock Alerts' },
        { path: '/admin/coupons', icon: Tag, label: 'Coupons' },
        { path: '/admin/pages', icon: FileText, label: 'Manage Pages' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl flex flex-col z-10">
                <div className="h-24 border-b flex items-center justify-center p-4">
                    <img src="/images/logo.png" alt="Arundhati Admin" className="h-16 w-auto object-contain" />
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[var(--color-primary)] text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-[var(--color-primary)]'} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t bg-gray-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-100 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
