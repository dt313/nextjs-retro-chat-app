import axios from '@/config/axios';

export const getUsers = async (q = '', page = 1) => {
    try {
        const res = await axios.get(`/users?q=${q}&page=${page}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};

export const getUserById = async (id) => {
    try {
        const res = await axios.get(`/users/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch user');
    }
};

export const getUserByUsername = async (username) => {
    try {
        const res = await axios.get(`/users/username/${username}`);
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch user');
    }
};

export const getFriends = async (name) => {
    try {
        const res = await axios.get(`/users/friends?name=${name}`);
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch user');
    }
};

export const resetPassword = async (email, password) => {
    try {
        const res = await axios.post(`/users/reset-password`, { email, password });
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to reset password');
    }
};

export const getFriendsByUserId = async (id) => {
    try {
        const res = await axios.get(`/users/${id}/friends`);
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to get friends by user id');
    }
};

export const updateProfile = async (formData) => {
    try {
        const res = await axios.put(`/users/me`, formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to update profile');
    }
};
