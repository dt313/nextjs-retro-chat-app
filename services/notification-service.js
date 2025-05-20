import axios from '@/config/axios';

export const getAllNotifications = async (before = '') => {
    try {
        const res = await axios.get(`/notifications/?before=${before}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to friend request');
    }
};

export const readNotification = async (id) => {
    try {
        const res = await axios.get(`/notifications/read/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to read notification');
    }
};
