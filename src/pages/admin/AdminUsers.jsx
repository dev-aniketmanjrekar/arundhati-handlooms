import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import PasswordInput from '../../components/PasswordInput';
import API_URL from '../../config';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        pincode: '',
        role: 'customer'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: { 'x-auth-token': authToken }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('token');

        try {
            const url = editingUser
                ? `${API_URL}/admin/users/${editingUser.id}`
                : `${API_URL}/admin/users`;

            const method = editingUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchUsers();
                setIsModalOpen(false);
                setEditingUser(null);
                resetForm();
            } else {
                const data = await response.json();
                alert(data.message || 'Error saving user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't populate password
            phone: user.phone || '',
            address: user.address || '',
            pincode: user.pincode || '',
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': authToken }
            });

            if (response.ok) {
                fetchUsers();
            } else {
                alert('Error deleting user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            pincode: '',
            role: 'customer'
        });
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Users</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add User</span>
                                >
                    {editingUser ? 'Update User' : 'Create User'}
                </button>
            </div>
        </form>
                </div >
                </div >
    )
}
        </AdminLayout >
    );
};

export default AdminUsers;
