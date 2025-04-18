import axios from '@/config/axios';

export const getUsers = async () => {
    try {
        const res = await axios.get('/users');
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
