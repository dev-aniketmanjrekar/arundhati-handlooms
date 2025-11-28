import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, X, Upload, Download, Settings } from 'lucide-react';
import API_URL from '../../config';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [globalDiscount, setGlobalDiscount] = useState(20);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', category: 'Saree', price: '', description: '', image_url: '', images: [],
        color: '', fabric_type: '', sku: '', size: '', wholesale_price: '', retail_price: '',
        discount_percent: 20, is_new: false, is_best_seller: false, stock_quantity: 100
    });

    useEffect(() => { fetchProducts(); fetchGlobalDiscount(); }, []);

    const fetchProducts = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/products`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setProductNames([...new Set(data.map(p => p.name))]);
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
                headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
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

        const formDataObj = new FormData();
        formDataObj.append('file', file);

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/products/bulk-import`, {
                method: 'POST',
                headers: { 'x-auth-token': authToken },
                body: formDataObj
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
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (name === 'name' && value) setShowSuggestions(true);
    };

    const handleNameSelect = (selectedName) => {
        const existingProduct = products.find(p => p.name === selectedName);
        if (existingProduct && !editingProduct) {
            setFormData(prev => ({
                ...prev, name: selectedName, category: existingProduct.category,
                description: existingProduct.description, fabric_type: existingProduct.fabric_type || '',
                is_new: existingProduct.is_new, is_best_seller: existingProduct.is_best_seller
            }));
        } else {
            setFormData(prev => ({ ...prev, name: selectedName }));
        }
        setShowSuggestions(false);
    };

    const getFilteredSuggestions = () => {
        if (!formData.name) return [];
        return productNames.filter(name => name.toLowerCase().includes(formData.name.toLowerCase()));
    };

    const getExistingColors = () => {
        if (!formData.name) return [];
        return products.filter(p => p.name === formData.name).map(p => p.color).filter(Boolean);
    };

    const calculateOfferPrice = (retailPrice, discount) => {
        if (!retailPrice || !discount) return 0;
        return Math.round(retailPrice * (1 - discount / 100));
    };

    const handleImageAdd = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            setFormData(prev => ({
                ...prev, images: [...prev.images, url], image_url: prev.image_url || url
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
                headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.sku) alert(`✅ Product created with SKU: ${data.sku}`);
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
        if (!window.confirm('Are you sure?')) return;
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/products/${id}`, {
                method: 'DELETE', headers: { 'x-auth-token': authToken }
            });
            if (response.ok) fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name, category: product.category, price: product.price,
            description: product.description, image_url: product.image_url,
            images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [],
            color: product.color, fabric_type: product.fabric_type || '', sku: product.sku || '',
            size: product.size || '', wholesale_price: product.wholesale_price || '',
            retail_price: product.retail_price || product.price, discount_percent: product.discount_percent || 20,
            is_new: product.is_new, is_best_seller: product.is_best_seller, stock_quantity: product.stock_quantity
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '', category: 'Saree', price: '', description: '', image_url: '', images: [],
            color: '', fabric_type: '', sku: '', size: '', wholesale_price: '', retail_price: '',
            discount_percent: 20, is_new: false, is_best_seller: false, stock_quantity: 100
        });
    };

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.name]) acc[product.name] = [];
        acc[product.name].push(product);
        return acc;
    }, {});

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
                <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setIsSettingsOpen(true)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                        <Settings size={18} /><span className="hidden sm:inline">Discount</span>
                    </button>
                    <button onClick={downloadTemplate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                        <Download size={18} /><span className="hidden sm:inline">Template</span>
                    </button>
                    <button onClick={() => fileInputRef.current.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                        <Upload size={18} /><span className="hidden sm:inline">Import</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleBulkImport} className="hidden" />
                    <button onClick={() => { setEditingProduct(null); resetForm(); setIsModalOpen(true); }} className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center space-x-2">
                        <Plus size={18} /><span>Add Product</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-3 py-2 font-medium text-gray-500">Image</th>
                                <th className="px-3 py-2 font-medium text-gray-500">SKU</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Name</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Category</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Color</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Fabric</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Size</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Wholesale</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Retail</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Offer</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Stock</th>
                                <th className="px-3 py-2 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="11" className="px-3 py-3 text-center">Loading...</td></tr>
                            ) : Object.entries(groupedProducts).map(([name, variants]) => (
                                variants.map((product, idx) => (
                                    <tr key={product.id} className={`hover:bg-gray-50 ${idx > 0 ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-3 py-2"><img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded" /></td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{product.sku || '-'}</td>
                                        <td className="px-3 py-2">
                                            <div className="font-medium text-gray-900 text-xs">{product.name}</div>
                                            {variants.length > 1 && idx === 0 && <span className="text-xs text-blue-600">{variants.length} variants</span>}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{product.category}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{product.color}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{product.fabric_type || '-'}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{product.size || '-'}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">₹{product.wholesale_price || '-'}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">₹{product.retail_price || product.price}</td>
                                        <td className="px-3 py-2 text-xs text-green-600 font-medium">₹{calculateOfferPrice(product.retail_price || product.price, product.discount_percent || 20)}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{product.stock_quantity}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex space-x-2">
                                                <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800"><Edit size={14} /></button>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
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
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500"><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Global Discount Percentage</label>
                                <input type="number" value={globalDiscount} onChange={(e) => setGlobalDiscount(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" min="0" max="100" />
                                <p className="text-xs text-gray-500 mt-1">This will update the discount for ALL products</p>
                            </div>
                            <button onClick={() => updateGlobalDiscount(globalDiscount)} className="w-full bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900">
                                Update Global Discount
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className="w-full border rounded-lg px-3 py-2" required />
                                    {showSuggestions && getFilteredSuggestions().length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                            {getFilteredSuggestions().map((name, idx) => (
                                                <div key={idx} onMouseDown={(e) => { e.preventDefault(); handleNameSelect(name); }} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">{name}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                                        <option value="Saree">Saree</option>
                                        <option value="Blouse">Blouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                                    {getExistingColors().length > 0 && <p className="text-xs text-gray-500 mt-1">Existing: {getExistingColors().join(', ')}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                                    <input type="text" name="fabric_type" value={formData.fabric_type} onChange={handleInputChange} placeholder="e.g., Silk, Cotton, Banarasi" className="w-full border rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Size {formData.category === 'Saree' ? '(in meters)' : formData.category === 'Blouse' ? '(Free Size)' : ''}
                                    </label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={formData.size || (formData.category === 'Saree' ? '6 meters' : formData.category === 'Blouse' ? '34-42' : '')}
                                        onChange={handleInputChange}
                                        placeholder={formData.category === 'Saree' ? '6 meters' : formData.category === 'Blouse' ? '34-42' : 'Size'}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    {formData.category === 'Blouse' && <p className="text-xs text-gray-500 mt-1">Free size fitting 34-42</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU {formData.sku && `(${formData.sku})`}</label>
                                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="Auto-generated if empty" className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Price</label>
                                    <input type="number" name="wholesale_price" value={formData.wholesale_price} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price (MRP) *</label>
                                    <input type="number" name="retail_price" value={formData.retail_price} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
                                    {formData.retail_price && (
                                        <p className="text-sm text-green-600 mt-1 font-medium">
                                            Offer Price: ₹{calculateOfferPrice(formData.retail_price, formData.discount_percent)}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                                    <input type="number" name="discount_percent" value={formData.discount_percent} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" min="0" max="100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" rows="3"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.images.map((img, idx) => (
                                        <img key={idx} src={img} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                                    ))}
                                    <button type="button" onClick={handleImageAdd} className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:text-gray-600">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Click + to add image URL</p>
                            </div>

                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="is_new" checked={formData.is_new} onChange={handleInputChange} className="rounded text-red-600" />
                                    <span className="text-sm font-medium text-gray-700">New Arrival</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="is_best_seller" checked={formData.is_best_seller} onChange={handleInputChange} className="rounded text-red-600" />
                                    <span className="text-sm font-medium text-gray-700">Best Seller</span>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900">{editingProduct ? 'Update Product' : 'Create Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
