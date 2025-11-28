import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { getCartCount } = useCart();
    const { user } = useAuth();
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Determine styles based on scroll and page
    const navClass = `fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome
        ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
        : 'bg-transparent py-4'
        }`;

    const textClass = scrolled || !isHome ? 'text-gray-800' : 'text-white';
    const logoClass = scrolled || !isHome ? 'text-[var(--color-primary)]' : 'text-white';
    const iconClass = scrolled || !isHome ? 'text-gray-600 hover:text-[var(--color-primary)]' : 'text-white/90 hover:text-white';

    return (
        <nav className={navClass}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/images/logo.png"
                            alt="Arundhati Handlooms"
                            className="h-12 md:h-16 w-auto object-contain transition-all duration-300"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                            <NavLink
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className={({ isActive }) =>
                                    `text-sm font-medium uppercase tracking-wider transition-colors hover:text-[var(--color-secondary)] ${isActive
                                        ? (scrolled || !isHome ? 'text-[var(--color-primary)]' : 'text-white font-bold')
                                        : textClass
                                    }`
                                }
                            >
                                {item}
                            </NavLink>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className={`transition-colors ${iconClass}`}>
                            <Search size={20} />
                        </button>

                        {user ? (
                            <Link to="/profile" className={`flex items-center gap-2 transition-colors ${iconClass}`}>
                                <User size={20} />
                                <span className="text-sm font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link to="/login" className={`transition-colors ${iconClass}`}>
                                <User size={20} />
                            </Link>
                        )}

                        <Link to="/cart" className={`relative transition-colors ${iconClass}`}>
                            <ShoppingBag size={20} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className={`relative transition-colors ${iconClass}`}>
                            <ShoppingBag size={20} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className={`transition-colors ${iconClass}`}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                    {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                        <NavLink
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `text-lg font-medium transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-700 hover:text-[var(--color-primary)]'}`
                            }
                        >
                            {item}
                        </NavLink>
                    ))}
                    <div className="w-full border-t border-gray-100 pt-4 flex justify-center gap-6">
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-[var(--color-primary)] flex flex-col items-center gap-1">
                            <User size={20} />
                            <span className="text-xs">Profile</span>
                        </Link>
                        <button className="text-gray-600 hover:text-[var(--color-primary)] flex flex-col items-center gap-1">
                            <Search size={20} />
                            <span className="text-xs">Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
