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
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b flex justify-center">
                    <img src="/images/logo.png" alt="Arundhati Admin" className="h-12 w-auto object-contain" />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-red-50 text-red-800'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
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
