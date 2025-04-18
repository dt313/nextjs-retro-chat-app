import axios from '@/config/axios';

export const getAllNotifications = async (id) => {
    try {
        const res = await axios.get(`/notifications/by-user/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to friend request');
    }
};
