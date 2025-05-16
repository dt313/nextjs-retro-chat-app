import axios from '@/config/axios';

export const getUsers = async (q) => {
    try {
        const res = await axios.get(`/users?q=${q}`);
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
