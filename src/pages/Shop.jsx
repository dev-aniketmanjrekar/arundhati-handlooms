import React, { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SEO from '../components/SEO';
import API_URL from '../config';
import axios from 'axios';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        priceRange: { min: 0, max: 100000 },
        size: ''
    });

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

    const categories = [...new Set(products.map(p => p.category))];
    const sizes = [...new Set(products.map(p => p.size).filter(Boolean))];

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

    const filteredProducts = useMemo(() => {
        return mergedProducts.filter(product => {
            const categoryMatch = filters.category ? product.category === filters.category : true;
            const sizeMatch = filters.size ? product.size === filters.size : true;
            const priceMatch = product.price >= filters.priceRange.min &&
                (filters.priceRange.max ? product.price <= filters.priceRange.max : true);
            return categoryMatch && priceMatch && sizeMatch;
        });
    }, [filters, mergedProducts]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-[var(--color-bg)] min-h-screen py-12">
            <SEO
                title="Shop Handloom Sarees -Arundhati Handlooms"
                description="Browse our exquisite collection of handloom sarees. Filter by category, price, and size to find your perfect traditional wear."
                keywords="buy handloom sarees online, traditional sarees shop, silk sarees, cotton sarees, wedding sarees"
            />
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold mb-2">Shop Collection</h1>
                        <p className="text-gray-500">{filteredProducts.length} Products Found</p>
                    </div>
                    <button
                        className="md:hidden flex items-center gap-2 text-[var(--color-primary)] font-medium"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Filter size={20} /> Filters
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        categories={categories}
                        sizes={sizes}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={{
                                        ...product,
                                        image: product.image_url, // Map DB field to UI prop
                                        isNew: product.is_new,
                                        isBestSeller: product.is_best_seller
                                    }} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-medium text-gray-600">No products found matching your criteria.</h3>
                                <button
                                    onClick={() => setFilters({ category: '', priceRange: { min: 0, max: 100000 } })}
                                    className="mt-4 text-[var(--color-primary)] underline"
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
