import React from 'react';
import { X, RotateCcw } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, categories, sizes, fabrics, isOpen, onClose }) => {
    const handleCategoryChange = (category) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === category ? '' : category
        }));
    };

    const handleFabricChange = (fabric) => {
        setFilters(prev => ({
            ...prev,
            fabric: prev.fabric === fabric ? '' : fabric
        }));
    };

    const handleSizeChange = (size) => {
        setFilters(prev => ({
            ...prev,
            size: prev.size === size ? '' : size
        }));
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [name]: Number(value)
            }
        }));
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            priceRange: { min: 0, max: 100000 },
            size: '',
            fabric: ''
        });
    };

    const FilterChip = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isActive
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className={`
      fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
      md:relative md:transform-none md:w-72 md:shadow-none md:block md:bg-transparent
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
            <div className="h-full overflow-y-auto bg-white md:bg-transparent md:pr-4">
                {/* Mobile Header */}
                <div className="flex justify-between items-center p-6 md:hidden border-b">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Desktop Header / Reset */}
                <div className="hidden md:flex justify-between items-center mb-6">
                    <h3 className="font-serif font-bold text-xl text-gray-800">Filters</h3>
                    <button
                        onClick={resetFilters}
                        className="text-xs text-gray-500 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={12} /> Reset
                    </button>
                </div>

                <div className="p-6 md:p-0 space-y-8">
                    {/* Categories */}
                    <div className="bg-white md:p-6 md:rounded-2xl md:shadow-sm">
                        <h3 className="font-serif font-bold text-lg mb-4 text-gray-800">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip
                                label="All"
                                isActive={filters.category === ''}
                                onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                            />
                            {categories.map(cat => (
                                <FilterChip
                                    key={cat}
                                    label={cat}
                                    isActive={filters.category === cat}
                                    onClick={() => handleCategoryChange(cat)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Fabrics */}
                    {fabrics && fabrics.length > 0 && (
                        <div className="bg-white md:p-6 md:rounded-2xl md:shadow-sm">
                            <h3 className="font-serif font-bold text-lg mb-4 text-gray-800">Fabric</h3>
                            <div className="flex flex-wrap gap-2">
                                <FilterChip
                                    label="All"
                                    isActive={filters.fabric === ''}
                                    onClick={() => setFilters(prev => ({ ...prev, fabric: '' }))}
                                />
                                {fabrics.map(fabric => (
                                    <FilterChip
                                        key={fabric}
                                        label={fabric}
                                        isActive={filters.fabric === fabric}
                                        onClick={() => handleFabricChange(fabric)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {sizes && sizes.length > 0 && (
                        <div className="bg-white md:p-6 md:rounded-2xl md:shadow-sm">
                            <h3 className="font-serif font-bold text-lg mb-4 text-gray-800">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                <FilterChip
                                    label="All"
                                    isActive={filters.size === ''}
                                    onClick={() => setFilters(prev => ({ ...prev, size: '' }))}
                                />
                                {sizes.map(size => (
                                    <FilterChip
                                        key={size}
                                        label={size}
                                        isActive={filters.size === size}
                                        onClick={() => handleSizeChange(size)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Range */}
                    <div className="bg-white md:p-6 md:rounded-2xl md:shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-serif font-bold text-lg text-gray-800">Price Range</h3>
                            <span className="text-sm font-medium text-[var(--color-primary)]">
                                ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
                            </span>
                        </div>
                        <div className="space-y-6">
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                value={filters.priceRange.max}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] hover:accent-[var(--color-secondary)] transition-colors"
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider">Min Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="min"
                                            value={filters.priceRange.min}
                                            onChange={handlePriceChange}
                                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider">Max Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="max"
                                            value={filters.priceRange.max}
                                            onChange={handlePriceChange}
                                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="w-full md:hidden py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={18} /> Reset All Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
