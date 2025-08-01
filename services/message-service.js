import axios from '@/config/axios';

export const create = async (id, data) => {
    try {
        const res = await axios.post(`/messages/to/${id}`, data, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to create message');
    }
};

export const createCallMessage = async (id, data) => {
    try {
        const res = await axios.post(`/messages/call-message/to/${id}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to create message');
    }
};

export const reaction = async (messageId, data) => {
    try {
        const res = await axios.post(`/messages/reaction/${messageId}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to create message');
    }
};

export const cancelReaction = async (reactionId) => {
    try {
        const res = await axios.post(`/messages/reaction/cancel/${reactionId}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to create message');
    }
};

export const forwardMessage = async (messageId, data) => {
    try {
        const res = await axios.post(`/messages/forward/${messageId}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to forward message');
    }
};

export const deleteMessage = async (messageType, messageId) => {
    try {
        const res = await axios.delete(`/messages/${messageType}/${messageId}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to delete message');
    }
};
