import axios from '@/config/axios';

export const createFriendRequest = async ({ id, requesterId }) => {
    try {
        const res = await axios.post(`/invitation/user/${id}`, { requesterId });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to friend request');
    }
};

export const replyFriendRequest = async ({ id, data }) => {
    try {
        const res = await axios.post(`/invitation/user/reply/${id}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to reply request');
    }
};
