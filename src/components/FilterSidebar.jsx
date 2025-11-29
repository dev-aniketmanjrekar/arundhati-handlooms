import React from 'react';
import { X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, categories, sizes, fabrics, isOpen, onClose }) => {
    const handleCategoryChange = (category) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === category ? '' : category
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

    return (
        <div className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
      md:relative md:transform-none md:w-64 md:shadow-none md:block
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
            <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-serif font-bold">Filters</h2>
                    <button onClick={onClose} className="text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="font-medium text-lg mb-4 border-b pb-2">Categories</h3>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.category === ''}
                                onChange={() => setFilters(prev => ({ ...prev, category: '' }))}
                                className="form-checkbox h-4 w-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                            />
                            <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">All Products</span>
                        </label>
                        {categories.map(cat => (
                            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.category === cat}
                                    onChange={() => handleCategoryChange(cat)}
                                    className="form-checkbox h-4 w-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                                />
                                <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">{cat}s</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Fabrics */}
                {fabrics && fabrics.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-medium text-lg mb-4 border-b pb-2">Fabric</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.fabric === ''}
                                    onChange={() => setFilters(prev => ({ ...prev, fabric: '' }))}
                                    className="form-checkbox h-4 w-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                                />
                                <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">All Fabrics</span>
                            </label>
                            {fabrics.map(fabric => (
                                <label key={fabric} className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.fabric === fabric}
                                        onChange={() => setFilters(prev => ({ ...prev, fabric: prev.fabric === fabric ? '' : fabric }))}
                                        className="form-checkbox h-4 w-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                                    />
                                    <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">{fabric}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {sizes && sizes.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-medium text-lg mb-4 border-b pb-2">Size</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.size === ''}
                                    onChange={() => setFilters(prev => ({ ...prev, size: '' }))}
                                    className="form-checkbox h-4 w-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                                />
                                <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">All Sizes</span>
                            </label>
                            {sizes.map(size => (
                                <label key={size} className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.size === size}
                                        onChange={() => setFilters(prev => ({ ...prev, size: prev.size === size ? '' : size }))}
                                        className="form-checkbox h-4 w-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                                    />
                                    <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range */}
                <div className="mb-8">
                    <h3 className="font-medium text-lg mb-4 border-b pb-2">Price Range</h3>
                    <div className="space-y-6">
                        {/* Slider */}
                        <div>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                value={filters.priceRange.max}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹0</span>
                                <span>₹100,000</span>
                            </div>
                        </div>

                        {/* Manual Inputs */}
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                <input
                                    type="number"
                                    name="min"
                                    value={filters.priceRange.min}
                                    onChange={handlePriceChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                <input
                                    type="number"
                                    name="max"
                                    value={filters.priceRange.max}
                                    onChange={handlePriceChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
