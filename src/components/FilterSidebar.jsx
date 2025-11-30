import React, { useState } from 'react';
import { X, RotateCcw, ChevronDown, ChevronUp, Check } from 'lucide-react';

const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-100 py-6 last:border-0">
        <button
            onClick={onToggle}
            className="flex justify-between items-center w-full group"
        >
            <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{title}</h3>
            {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            {children}
        </div>
    </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group py-1.5 select-none">
        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${checked
                ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                : 'border-gray-300 bg-white group-hover:border-[var(--color-primary)]'
            }`}>
            {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
            {label}
        </span>
        <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={onChange}
        />
    </label>
);

const FilterSidebar = ({ filters, setFilters, categories, sizes, fabrics, isOpen, onClose }) => {
    // State for collapsible sections
    const [openSections, setOpenSections] = useState({
        category: true,
        fabric: true,
        size: true,
        price: true
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                md:relative md:transform-none md:w-72 md:shadow-none md:block md:bg-transparent md:border-r md:border-gray-100 md:pr-8
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-full flex flex-col bg-white md:bg-transparent">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b md:border-none md:px-0 md:pt-0">
                        <h2 className="text-xl font-serif font-bold text-gray-900">Filters</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={resetFilters}
                                className="text-xs font-medium text-gray-500 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors uppercase tracking-wider"
                            >
                                <RotateCcw size={12} /> Reset
                            </button>
                            <button onClick={onClose} className="md:hidden text-gray-500 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:px-0 md:py-2 custom-scrollbar">
                        {/* Categories */}
                        <FilterSection
                            title="Categories"
                            isOpen={openSections.category}
                            onToggle={() => toggleSection('category')}
                        >
                            <div className="space-y-1">
                                <CheckboxItem
                                    label="All Products"
                                    checked={filters.category === ''}
                                    onChange={() => setFilters(prev => ({ ...prev, category: '' }))}
                                />
                                {categories.map(cat => (
                                    <CheckboxItem
                                        key={cat}
                                        label={cat}
                                        checked={filters.category === cat}
                                        onChange={() => handleCategoryChange(cat)}
                                    />
                                ))}
                            </div>
                        </FilterSection>

                        {/* Fabrics */}
                        {fabrics && fabrics.length > 0 && (
                            <FilterSection
                                title="Fabric"
                                isOpen={openSections.fabric}
                                onToggle={() => toggleSection('fabric')}
                            >
                                <div className="space-y-1">
                                    <CheckboxItem
                                        label="All Fabrics"
                                        checked={filters.fabric === ''}
                                        onChange={() => setFilters(prev => ({ ...prev, fabric: '' }))}
                                    />
                                    {fabrics.map(fabric => (
                                        <CheckboxItem
                                            key={fabric}
                                            label={fabric}
                                            checked={filters.fabric === fabric}
                                            onChange={() => handleFabricChange(fabric)}
                                        />
                                    ))}
                                </div>
                            </FilterSection>
                        )}

                        {/* Sizes */}
                        {sizes && sizes.length > 0 && (
                            <FilterSection
                                title="Size"
                                isOpen={openSections.size}
                                onToggle={() => toggleSection('size')}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, size: '' }))}
                                        className={`py-2 text-sm border rounded hover:border-[var(--color-primary)] transition-colors ${filters.size === ''
                                                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                                : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeChange(size)}
                                            className={`py-2 text-sm border rounded hover:border-[var(--color-primary)] transition-colors ${filters.size === size
                                                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                                    : 'bg-white text-gray-600 border-gray-200'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>
                        )}

                        {/* Price Range */}
                        <FilterSection
                            title="Price"
                            isOpen={openSections.price}
                            onToggle={() => toggleSection('price')}
                        >
                            <div className="space-y-6 pt-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="1000"
                                    value={filters.priceRange.max}
                                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] hover:accent-[var(--color-secondary)] transition-colors"
                                />
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Min</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                            <input
                                                type="number"
                                                name="min"
                                                value={filters.priceRange.min}
                                                onChange={handlePriceChange}
                                                className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Max</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                            <input
                                                type="number"
                                                name="max"
                                                value={filters.priceRange.max}
                                                onChange={handlePriceChange}
                                                className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FilterSection>
                    </div>

                    {/* Mobile Footer */}
                    <div className="p-6 border-t md:hidden bg-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg shadow-lg active:scale-95 transition-transform"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;
