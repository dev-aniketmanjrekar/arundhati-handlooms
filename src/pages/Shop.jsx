import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SEO from '../components/SEO';
import API_URL from '../config';
import axios from 'axios';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filter States
    const [filters, setFilters] = useState({
        category: '',
        priceRange: { min: 0, max: 100000 },
        size: '',
        fabric: ''
    });

    // New Feature States
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

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

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery, sortBy]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const categories = [...new Set(products.map(p => p.category))];
    const sizes = [...new Set(products.map(p => p.size).filter(Boolean))];
    const fabrics = [...new Set(products.map(p => p.fabric_type).filter(Boolean))];

    // Merge products by name (group variants)
    const mergedProducts = useMemo(() => {
        const grouped = {};
        products.forEach(product => {
            if (!grouped[product.name]) {
                grouped[product.name] = {
                    ...product,
                    variants: []
                };
            }
            grouped[product.name].variants.push({
                id: product.id,
                color: product.color,
                slug: product.slug,
                price: product.price,
                image_url: product.image_url
            });
        });
        return Object.values(grouped);
    }, [products]);

    // Filter, Search, and Sort Logic
    const processedProducts = useMemo(() => {
        let result = mergedProducts.filter(product => {
            const categoryMatch = filters.category ? product.category === filters.category : true;
            const sizeMatch = filters.size ? product.size === filters.size : true;
            const fabricMatch = filters.fabric ? product.fabric_type === filters.fabric : true;
            const priceMatch = product.price >= filters.priceRange.min &&
                (filters.priceRange.max ? product.price <= filters.priceRange.max : true);
            const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

            return categoryMatch && priceMatch && sizeMatch && fabricMatch && searchMatch;
        });

        // Sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }

        return result;
    }, [filters, mergedProducts, searchQuery, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
    const paginatedProducts = processedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
    );

    return (
        <div className="bg-[var(--color-bg)] min-h-screen pb-12">
            <SEO
                title="Shop Handloom Sarees - Arundhati Handlooms"
                description="Browse our exquisite collection of handloom sarees. Filter by category, price, and size to find your perfect traditional wear."
                keywords="buy handloom sarees online, traditional sarees shop, silk sarees, cotton sarees, wedding sarees"
            />

            {/* Hero Section */}
            <div className="relative bg-[var(--color-primary)] text-white py-20 mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide">Our Collection</h1>
                    <div className="w-24 h-1 bg-[var(--color-secondary)] mx-auto mb-8 rounded-full"></div>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover the timeless elegance of handwoven sarees, crafted with passion and tradition.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Controls Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for sarees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Mobile Filter Toggle */}
                        <button
                            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Filter size={20} />
                            <span>Filters</span>
                        </button>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-gray-500 text-sm hidden sm:inline">Sort by:</span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name-asc">Name: A to Z</option>
                                </select>
                                <SlidersHorizontal size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        categories={categories}
                        sizes={sizes}
                        fabrics={fabrics}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {processedProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {paginatedProducts.map(product => (
                                        <ProductCard key={product.id} product={{
                                            ...product,
                                            image: product.image_url,
                                            isNew: product.is_new,
                                            isBestSeller: product.is_best_seller
                                        }} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === i + 1
                                                    ? 'bg-[var(--color-primary)] text-white'
                                                    : 'hover:bg-gray-50 text-gray-600'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                                <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                    <Search size={48} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setFilters({ category: '', priceRange: { min: 0, max: 100000 }, size: '', fabric: '' });
                                        setSearchQuery('');
                                    }}
                                    className="text-[var(--color-primary)] font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
