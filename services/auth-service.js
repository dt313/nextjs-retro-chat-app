import axios from '@/config/axios';

export const login = async (data) => {
    try {
        const res = await axios.post('/auth/login', data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to login');
    }
};

export const register = async (data) => {
    try {
        const res = await axios.post('/auth/register', data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to login');
    }
};

export const logout = async (data) => {
    try {
        const res = await axios.get('/auth/logout', data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to login');
    }
};

export const test = async () => {
    try {
        const res = await axios.get('/auth/public');
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to public');
    }
};

export const refreshToken = async () => {
    try {
        const res = await axios.get('/auth/refresh-token');
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get refresh token');
    }
};

export const googleAuth = async () => {
    try {
        const res = await axios.get('/auth/google');
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to login');
    }
};
