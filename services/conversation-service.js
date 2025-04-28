import axios from '@/config/axios';

export const create = async (data) => {
    try {
        const res = await axios.post('/conversations', data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to create conversation');
    }
};

export const getByMe = async () => {
    try {
        const res = await axios.get(`/conversations/me`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get conversations');
    }
};

export const getConversationById = async (id) => {
    try {
        const res = await axios.get(`/conversations/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get conversations');
    }
};

export const getMessageOfConversationById = async (id) => {
    try {
        const res = await axios.get(`/conversations/message/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get conversations');
    }
};
