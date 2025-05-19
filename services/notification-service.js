import axios from '@/config/axios';

export const getAllNotifications = async (before = '') => {
    try {
        const res = await axios.get(`/notifications/?before=${before}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to friend request');
    }
};
