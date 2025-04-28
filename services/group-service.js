import axios from '@/config/axios';

export const getGroups = async () => {
    try {
        const res = await axios.get('/groups');
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};

export const getGroupById = async (id) => {
    try {
        const res = await axios.get(`/groups/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};

export const joinGroup = async (id, data) => {
    try {
        const res = await axios.post(`/groups/join/${id}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};
