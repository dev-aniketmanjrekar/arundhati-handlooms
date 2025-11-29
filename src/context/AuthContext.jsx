import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Validate token from localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken === 'undefined' || storedToken === 'null') {
            localStorage.removeItem('token');
            setToken(null);
            setLoading(false);
            return;
        }

        if (token && !user) {
            fetchProfile(token);
        } else {
            setLoading(false);
        }
    }, [token, user]);

    const fetchProfile = async (authToken) => {
        // Double check token validity
        if (!authToken || authToken === 'undefined' || authToken === 'null') {
            logout();
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/profile`, {
                headers: { 'x-auth-token': authToken }
            });
            setUser(response.data);
        } catch (error) {
            console.error('AuthContext: Error fetching profile:', error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log('AuthContext: Token invalid or expired. Logging out.');
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return { success: true, user };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
