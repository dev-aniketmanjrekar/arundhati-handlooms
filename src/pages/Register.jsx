import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        pincode: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(formData);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <input
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        type="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        type="tel"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <textarea
                        name="address"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                        placeholder="Delivery Address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <input
                        name="pincode"
                        type="text"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                    />

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)]">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
