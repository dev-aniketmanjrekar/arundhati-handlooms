import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Heart, Star, Instagram, Award, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import API_URL from '../config';

import heroDesktop from '../assets/hero-desktop.png';
import heroMobile from '../assets/hero-mobile.png';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products`);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const newArrivals = products.filter(p => p.is_new).slice(0, 4);
    const bestSellers = products.filter(p => p.is_best_seller).slice(0, 4);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-[85vh] bg-gray-900 overflow-hidden">
                <picture>
                    <source media="(min-width: 768px)" srcSet={heroDesktop} />
                    <img
                        src={heroMobile}
                        alt="Handloom Saree Weaving"
                        className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom"
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl">
                        <span className="text-[var(--color-secondary)] tracking-[0.2em] uppercase text-sm font-medium mb-4 block animate-fade-in-up">Authentic Handloom</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
                            Weaving Tradition <br /> Into Elegance
                        </h1>
                        <p className="text-xl text-gray-200 mb-10 font-light max-w-2xl mx-auto animate-fade-in-up delay-200">
                            Discover the finest collection of authentic handwoven sarees and blouses, crafted with centuries of tradition and love.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                            <Link to="/shop" className="bg-[var(--color-secondary)] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[var(--color-primary)] transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20">
                                Shop Collection <ArrowRight size={20} />
                            </Link>
                            <Link to="/about" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white hover:text-black transition-all inline-flex items-center justify-center">
                                Our Story
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-12 bg-white border-b border-gray-100 relative z-10 -mt-8 mx-4 md:mx-12 rounded-xl shadow-xl">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                        <div className="flex flex-col items-center gap-3 p-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[var(--color-primary)] mb-2">
                                <Award size={24} />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Silk Mark Certified</h3>
                            <p className="text-sm text-gray-500">100% Authentic Handloom</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[var(--color-primary)] mb-2">
                                <Truck size={24} />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Free Shipping</h3>
                            <p className="text-sm text-gray-500">On all orders above ₹5000</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[var(--color-primary)] mb-2">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Secure Payment</h3>
                            <p className="text-sm text-gray-500">100% Secure Checkout</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[var(--color-primary)] mb-2">
                                <Clock size={24} />
                            </div>
                            <h3 className="font-serif font-bold text-lg">Fast Delivery</h3>
                            <p className="text-sm text-gray-500">Dispatched within 24 hours</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Preview */}
            <section className="py-20 bg-[var(--color-bg)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm uppercase">Shop By Category</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Curated Collections</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative h-[500px] group overflow-hidden rounded-2xl cursor-pointer shadow-lg">
                            <img
                                src="/images/golden-tissue-blue.png"
                                alt="Sarees"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                                <h3 className="text-4xl font-serif font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Sarees</h3>
                                <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Explore our exquisite collection of Banarasi, Chanderi, and Katan Silk sarees.</p>
                                <Link to="/shop" className="text-white underline decoration-[var(--color-secondary)] underline-offset-8 hover:text-[var(--color-secondary)] w-fit">
                                    View Collection
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[500px] group overflow-hidden rounded-2xl cursor-pointer shadow-lg">
                            <img
                                src="/images/handloom-ikat-blouse-red.png"
                                alt="Blouses"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                                <h3 className="text-4xl font-serif font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Blouses</h3>
                                <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Perfectly stitched designer blouses to complement your elegance.</p>
                                <Link to="/shop" className="text-white underline decoration-[var(--color-secondary)] underline-offset-8 hover:text-[var(--color-secondary)] w-fit">
                                    View Collection
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm">FRESH FROM LOOM</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">New Arrivals</h2>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium group">
                            View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newArrivals.map(product => (
                            <ProductCard key={product.id} product={{
                                ...product,
                                image: product.image_url,
                                isNew: product.is_new,
                                isBestSeller: product.is_best_seller
                            }} />
                        ))}
                    </div>
                    <div className="mt-12 text-center md:hidden">
                        <Link to="/shop" className="btn btn-outline">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Heritage Section */}
            <section className="py-24 bg-[var(--color-primary)] text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    {/* Pattern Overlay Placeholder */}
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="1" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#pattern)" />
                    </svg>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 border-2 border-[var(--color-secondary)] rounded-lg transform translate-x-4 translate-y-4"></div>
                            <img
                                src="/images/kalamkari-red.png"
                                alt="Weaving Heritage"
                                className="rounded-lg shadow-2xl relative z-10 w-full"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <span className="text-[var(--color-secondary)] tracking-widest text-sm font-medium uppercase mb-2 block">Our Heritage</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">The Art of <br />Timeless Weaving</h2>
                            <p className="text-gray-200 mb-8 leading-relaxed text-lg font-light">
                                Every thread tells a story. Our sarees are not just garments; they are a legacy woven by skilled artisans who have inherited this craft through generations. We bring you the authentic touch of India's rich handloom culture.
                            </p>
                            <div className="flex gap-8 mb-8">
                                <div>
                                    <h4 className="text-3xl font-serif font-bold text-[var(--color-secondary)]">50+</h4>
                                    <p className="text-sm text-gray-300">Years of Legacy</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-serif font-bold text-[var(--color-secondary)]">200+</h4>
                                    <p className="text-sm text-gray-300">Skilled Artisans</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-serif font-bold text-[var(--color-secondary)]">10k+</h4>
                                    <p className="text-sm text-gray-300">Happy Customers</p>
                                </div>
                            </div>
                            <Link to="/about" className="text-[var(--color-secondary)] border-b border-[var(--color-secondary)] pb-1 hover:text-white hover:border-white transition-colors inline-flex items-center gap-2">
                                Read Our Story <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-20 bg-[var(--color-bg)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm">CUSTOMER FAVORITES</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Best Sellers</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {bestSellers.map(product => (
                            <ProductCard key={product.id} product={{
                                ...product,
                                image: product.image_url,
                                isNew: product.is_new,
                                isBestSeller: product.is_best_seller
                            }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm">TESTIMONIALS</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">What Our Customers Say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[var(--color-bg)] p-8 rounded-2xl relative hover:shadow-lg transition-shadow">
                                <div className="text-[var(--color-secondary)] mb-4 flex gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={16} />)}
                                </div>
                                <p className="text-gray-600 mb-6 italic leading-relaxed">
                                    "{i === 1 ? "The quality of the silk is unmatched. I wore it to my sister's wedding and got so many compliments! Truly authentic." :
                                        i === 2 ? "Excellent customer service and fast delivery. The saree looks even better in person than in the pictures." :
                                            "I've bought 5 sarees from Arundhati so far, and each one is a masterpiece. Highly recommend for handloom lovers."}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-serif font-bold text-xl">
                                        {i === 1 ? "P" : i === 2 ? "A" : "S"}
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-serif text-gray-900">{i === 1 ? "Priya Sharma" : i === 2 ? "Anjali Gupta" : "Sneha Reddy"}</h4>
                                        <p className="text-xs text-gray-500">{i === 1 ? "Mumbai" : i === 2 ? "Delhi" : "Hyderabad"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instagram Feed Mockup */}
            <section className="py-20 bg-[var(--color-bg)] overflow-hidden">
                <div className="container mx-auto px-4 text-center mb-12">
                    <div className="flex items-center justify-center gap-2 text-[var(--color-primary)] mb-2">
                        <Instagram size={24} />
                        <span className="font-medium">@ArundhatiHandlooms</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold">Follow Us On Instagram</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-8 px-4 scrollbar-hide">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="min-w-[200px] h-[200px] md:min-w-[250px] md:h-[250px] rounded-lg overflow-hidden relative group cursor-pointer">
                            <img
                                src={`https://images.unsplash.com/photo-${i === 1 ? '1610030469841-12d7b8445147' : i === 2 ? '1583391733958-e026b14377f9' : i === 3 ? '1596205934513-56c63268565c' : i === 4 ? '1606760227091-3dd870d97f1d' : '1583391733958-e026b14377f9'}?q=80&w=400&auto=format&fit=crop`}
                                alt="Instagram Post"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                                <Instagram size={32} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 bg-[var(--color-primary)] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white">Join Our Family</h2>
                    <p className="mb-10 max-w-2xl mx-auto text-gray-200 text-lg font-light">
                        Subscribe to our newsletter to receive updates about new collections, special offers, and weaving stories directly to your inbox.
                    </p>
                    <form className="max-w-md mx-auto flex gap-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                        />
                        <button className="bg-[var(--color-secondary)] text-black px-8 py-4 rounded-full font-medium hover:bg-white transition-colors shadow-lg">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
