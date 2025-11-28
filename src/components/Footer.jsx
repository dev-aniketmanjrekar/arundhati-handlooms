import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    import logo from '../assets/logo.png';

                    // ... inside component ...
                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="mb-6 block">
                            <img src={logo} alt="Arundhati Handlooms" className="h-12 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-gray-200 mb-6 leading-relaxed">
                            Celebrating the timeless elegance of Indian handlooms. We bring you authentic, handcrafted sarees and blouses directly from master weavers.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://wa.me/919870934861" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors" title="WhatsApp 98709 34861">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            </a>
                            <a href="https://www.instagram.com/arundhati.handlooms/" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6 border-b border-white/20 pb-2 inline-block text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> Shop Collection
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> Our Story
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6 border-b border-white/20 pb-2 inline-block text-white">Customer Care</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/profile" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> My Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping-policy" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-200 hover:text-[var(--color-secondary)] transition-colors flex items-center gap-2">
                                    <ArrowRight size={14} /> FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6 border-b border-white/20 pb-2 inline-block text-white">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-200">
                                <MapPin size={20} className="text-[var(--color-secondary)] flex-shrink-0 mt-1" />
                                <span>Dadar, Ranade Road,<br />Mumbai - 400028</span>
                            </li>
                            <li>
                                <a href="tel:+917021512319" className="flex items-center gap-3 text-gray-200 hover:text-[var(--color-secondary)] transition-colors">
                                    <Phone size={20} className="text-[var(--color-secondary)] flex-shrink-0" />
                                    <span>+91 7021512319 / +91 98709 34861</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:orders@arundhatihandlooms.com" className="flex items-center gap-3 text-gray-200 hover:text-[var(--color-secondary)] transition-colors">
                                    <Mail size={20} className="text-[var(--color-secondary)] flex-shrink-0" />
                                    <span>orders@arundhatihandlooms.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-300 text-sm">
                    <p>&copy; {new Date().getFullYear()} Arundhati Handlooms. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
