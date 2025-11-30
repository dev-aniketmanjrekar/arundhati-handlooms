import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, ChevronDown, Package, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const { getCartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowUserDropdown(false);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src="/src/assets/logo.png" alt="Arundhati Handlooms" className="h-16 w-auto object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink to="/" className={({ isActive }) =>
                            `text-gray-700 hover:text-[var(--color-primary)] transition-colors ${isActive ? 'text-[var(--color-primary)] font-medium' : ''}`
                        }>
                            Home
                        </NavLink>
                        <NavLink to="/shop" className={({ isActive }) =>
                            `text-gray-700 hover:text-[var(--color-primary)] transition-colors ${isActive ? 'text-[var(--color-primary)] font-medium' : ''}`
                        }>
                            Shop
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) =>
                            `text-gray-700 hover:text-[var(--color-primary)] transition-colors ${isActive ? 'text-[var(--color-primary)] font-medium' : ''}`
                        }>
                            About Us
                        </NavLink>
                        <NavLink to="/contact" className={({ isActive }) =>
                            `text-gray-700 hover:text-[var(--color-primary)] transition-colors ${isActive ? 'text-[var(--color-primary)] font-medium' : ''}`
                        }>
                            Contact
                        </NavLink>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-[var(--color-primary)]">
                            <Search size={20} />
                        </button>

                        {/* User Dropdown */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="text-gray-600 hover:text-[var(--color-primary)] flex items-center gap-1"
                                >
                                    <User size={20} />
                                    <span className="text-sm font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
                                    <ChevronDown size={16} className={`transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserDropdown(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                to="/my-orders"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Package size={18} />
                                                <span>My Orders</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-[var(--color-primary)]">
                                <User size={20} />
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative text-gray-600 hover:text-[var(--color-primary)]">
                            <ShoppingBag size={20} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Mobile User Dropdown */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="text-gray-600 hover:text-[var(--color-primary)]"
                                >
                                    <User size={20} />
                                </button>

                                {/* Mobile Dropdown */}
                                {showUserDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserDropdown(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                to="/my-orders"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            >
                                                <Package size={18} />
                                                <span>My Orders</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-[var(--color-primary)]">
                                <User size={20} />
                            </Link>
                        )}

                        <Link to="/cart" className="relative text-gray-600 hover:text-[var(--color-primary)]">
                            <ShoppingBag size={20} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <NavLink to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-[var(--color-primary)]">
                            Home
                        </NavLink>
                        <NavLink to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-[var(--color-primary)]">
                            Shop
                        </NavLink>
                        <NavLink to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-[var(--color-primary)]">
                            About Us
                        </NavLink>
                        <NavLink to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-[var(--color-primary)]">
                            Contact
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
