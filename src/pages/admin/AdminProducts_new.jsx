import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, X, Upload, Download, Settings, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import API_URL from '../../config';
import { useSortableData } from '../../hooks/useSortableData';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [globalDiscount, setGlobalDiscount] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Saree',
        price: '',
        description: '',
        image_url: '',
        images: [],
        color: '',
        fabric_type: '',
        sku: '',
        size: '',
        wholesale_price: '',
        retail_price: '',
        discount_percent: 20,
        is_new: false,
        is_best_seller: false,
        stock_quantity: 100
    });

    useEffect(() => {
        fetchProducts();
        fetchGlobalDiscount();
    }, []);

    const fetchProducts = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/products`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                const names = [...new Set(data.map(p => p.name))];
                setProductNames(names);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGlobalDiscount = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/settings/discount`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setGlobalDiscount(data.discount);
            }
        } catch (error) {
            console.error('Error fetching discount:', error);
        }
    };

    const updateGlobalDiscount = async (newDiscount) => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/settings/discount`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken
                },
                body: JSON.stringify({ discount: newDiscount })
            });
            if (response.ok) {
                setGlobalDiscount(newDiscount);
                alert(`✅ Global discount updated to ${newDiscount}%!`);
                fetchProducts();
            }
        } catch (error) {
            console.error('Error updating discount:', error);
        }
    };

    const handleBulkImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/products/bulk-import`, {
                method: 'POST',
                headers: {
                    'x-auth-token': authToken
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert(`✅ Import completed!\n${data.successCount} products added\n${data.errorCount} errors`);
                fetchProducts();
            }
        } catch (error) {
            console.error('Error during bulk import:', error);
            alert('Error during bulk import');
        }

        // Reset file input
        e.target.value = '';
    };

    const downloadTemplate = () => {
        const template = 'Name,Category,Color,Fabric,Retail Price,Wholesale Price,Size,Stock\n' +
            'Example Saree,Saree,Red,Silk,20000,15000,,100\n' +
            'Example Blouse,Blouse,Blue,Cotton,3000,2000,36,50';

        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'product_template.csv';
        link.click();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'name' && value) {
            setShowSuggestions(true);
        }
    };

    const handleNameSelect = (selectedName) => {
        const existingProduct = products.find(p => p.name === selectedName);

        if (existingProduct && !editingProduct) {
            setFormData(prev => ({
                ...prev,
                name: selectedName,
                category: existingProduct.category,
                description: existingProduct.description,
                fabric_type: existingProduct.fabric_type || '',
                is_new: existingProduct.is_new,
                is_best_seller: existingProduct.is_best_seller
            }));
        } else {
            setFormData(prev => ({ ...prev, name: selectedName }));
        }

        setShowSuggestions(false);
    };

    const getFilteredSuggestions = () => {
        if (!formData.name) return [];
        return productNames.filter(name =>
            name.toLowerCase().includes(formData.name.toLowerCase())
        );
    };

    const getExistingColors = () => {
        if (!formData.name) return [];
        return products
            .filter(p => p.name === formData.name)
            .map(p => p.color)
            .filter(Boolean);
    };

    // Calculate offer price
    const calculateOfferPrice = (retailPrice, discount) => {
        if (!retailPrice || !discount) return 0;
        return retailPrice * (1 - discount / 100);
    };

    const handleImageAdd = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, url],
                image_url: prev.image_url || url
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('token');
        const url = editingProduct
            ? `${API_URL}/admin/products/${editingProduct.id}`
            : `${API_URL}/admin/products`;

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.sku) {
                    alert(`✅ Product created with SKU: ${data.sku}`);
                }
                fetchProducts();
                setIsModalOpen(false);
                setEditingProduct(null);
                resetForm();
            } else {
                const error = await response.json();
                alert(error.message || 'Error saving product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': authToken }
            });

            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            image_url: product.image_url,
            images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [],
            color: product.color,
            fabric_type: product.fabric_type || '',
            sku: product.sku || '',
            size: product.size || '',
            wholesale_price: product.wholesale_price || '',
            retail_price: product.retail_price || product.price,
            discount_percent: product.discount_percent || 20,
            is_new: product.is_new,
            is_best_seller: product.is_best_seller,
            stock_quantity: product.stock_quantity
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Saree',
            price: '',
            description: '',
            image_url: '',
            images: [],
            color: '',
            fabric_type: '',
            sku: '',
            size: '',
            wholesale_price: '',
            retail_price: '',
            discount_percent: 20,
            is_new: false,
            is_best_seller: false,
            stock_quantity: 100
        });
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Group products by name for variant display
    const groupedProducts = filteredProducts.reduce((acc, product) => {
        if (!acc[product.name]) {
            acc[product.name] = [];
        }
        acc[product.name].push(product);
        return acc;
    }, {});

    // Convert groups to sortable array
    const productGroups = Object.values(groupedProducts).map(variants => ({
        ...variants[0], // Use first variant as representative for sorting
        variants // Attach all variants
    }));

    // Sorting
    const { items: sortedGroups, requestSort, sortConfig } = useSortableData(productGroups);

    // Stats
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (Number(p.retail_price || p.price) * p.stock_quantity), 0);

    const SortIcon = ({ direction }) => {
        if (!direction) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
        return direction === 'ascending' ? <ArrowUp size={14} className="ml-1 text-gray-600" /> : <ArrowDown size={14} className="ml-1 text-gray-600" />;
    };

    const SortableHeader = ({ label, sortKey }) => (
        <th
            className="px-4 py-3 font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors select-none"
            onClick={() => requestSort(sortKey)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon direction={sortConfig?.key === sortKey ? sortConfig.direction : null} />
            </div>
        </th>
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your inventory and catalog</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <Settings size={20} />
                        <span>Discount Settings</span>
                    </button>
                    <button
                        onClick={downloadTemplate}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                        <Download size={20} />
                        <span>Template</span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Upload size={20} />
                        <span>Import</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleBulkImport}
                        className="hidden"
                    />
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Low Stock Items</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">{lowStockProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Inventory Value</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by Name or SKU..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Saree">Saree</option>
                    <option value="Lehenga">Lehenga</option>
                    <option value="Suit">Suit</option>
                    <option value="Fabric">Fabric</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-500">Image</th>
                                <SortableHeader label="SKU" sortKey="sku" />
                                <SortableHeader label="Name" sortKey="name" />
                                <SortableHeader label="Color" sortKey="color" />
                                <SortableHeader label="Fabric" sortKey="fabric_type" />
                                <SortableHeader label="Price" sortKey="retail_price" />
                                <SortableHeader label="Stock" sortKey="stock_quantity" />
                                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="8" className="px-4 py-4 text-center">Loading...</td></tr>
                            ) : sortedGroups.map((group) => (
                                group.variants.map((product, idx) => (
                                    <tr key={product.id} className={`hover:bg-gray-50 ${idx > 0 ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-4 py-3">
                                            <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600">{product.sku || '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            {group.variants.length > 1 && idx === 0 && (
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{group.variants.length} variants</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{product.color}</td>
                                        <td className="px-4 py-3 text-gray-600">{product.fabric_type || '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900">₹{product.retail_price || product.price}</span>
                                                {product.discount_percent > 0 && (
                                                    <span className="text-xs text-green-600">
                                                        {product.discount_percent}% OFF
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                                                    product.stock_quantity < 10 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {product.stock_quantity === 0 ? 'Out of Stock' :
                                                    product.stock_quantity < 10 ? `Low (${product.stock_quantity})` :
                                                        product.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex space-x-2">
                                                <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Global Discount Settings</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Global Discount Percentage
                                </label>
                                <input
                                    type="number"
                                    value={globalDiscount}
                                    onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    min="0"
                                    max="100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This will update the discount for ALL products
                                </p>
                            </div>
                            <button
                                onClick={() => updateGlobalDiscount(globalDiscount)}
                                className="w-full bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                            >
                                Update Global Discount
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2"
                                            required
                                            autoComplete="off"
                                        />
                                        {showSuggestions && getFilteredSuggestions().length > 0 && (
                                            <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                                                {getFilteredSuggestions().map((name, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleNameSelect(name)}
                                                    >
                                                        {name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="Saree">Saree</option>
                                        <option value="Lehenga">Lehenga</option>
                                        <option value="Suit">Suit</option>
                                        <option value="Fabric">Fabric</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                                    <input
                                        type="text"
                                        name="fabric_type"
                                        value={formData.fabric_type}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        list="colors"
                                    />
                                    <datalist id="colors">
                                        {getExistingColors().map((color, index) => (
                                            <option key={index} value={color} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="e.g. Free Size, S, M, L"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price (₹)</label>
                                    <input
                                        type="number"
                                        name="retail_price"
                                        value={formData.retail_price}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Price (₹)</label>
                                    <input
                                        type="number"
                                        name="wholesale_price"
                                        value={formData.wholesale_price}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount_percent"
                                        value={formData.discount_percent}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2 h-24"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                        className="flex-1 border rounded-lg px-3 py-2"
                                        placeholder="Main Image URL"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageAdd}
                                        className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
                                    >
                                        Add More
                                    </button>
                                </div>
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {formData.image_url && (
                                        <img src={formData.image_url} alt="Main" className="h-20 w-20 object-cover rounded border-2 border-blue-500" />
                                    )}
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img src={url} alt={`Gallery ${index}`} className="h-20 w-20 object-cover rounded border" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images.filter((_, i) => i !== index)
                                                }))}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_new"
                                        checked={formData.is_new}
                                        onChange={handleInputChange}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">New Arrival</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_best_seller"
                                        checked={formData.is_best_seller}
                                        onChange={handleInputChange}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Best Seller</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
                                >
                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
