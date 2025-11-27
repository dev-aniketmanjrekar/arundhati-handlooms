import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { getCartCount } = useCart();
    const { user } = useAuth();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                        Arundhati Handlooms
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

                        {user ? (
                            <Link to="/profile" className="text-gray-600 hover:text-[var(--color-primary)] flex items-center gap-2">
                                <User size={20} />
                                <span className="text-sm font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
                            </Link>
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
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <Link to="/cart" className="relative text-gray-600 hover:text-[var(--color-primary)] mr-4">
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
                        {user ? (
                            <NavLink to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-[var(--color-primary)]">
                                My Profile
                            </NavLink>
                        ) : (
                            <NavLink to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-[var(--color-primary)]">
                                Login / Register
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
