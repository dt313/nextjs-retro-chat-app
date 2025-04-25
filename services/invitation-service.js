import axios from '@/config/axios';

export const createFriendRequest = async ({ id }) => {
    try {
        const res = await axios.post(`/invitation/user/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to friend request');
    }
};

export const replyFriendRequest = async (data) => {
    try {
        const res = await axios.post(`/invitation/user/reply`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to reply request');
    }
};
