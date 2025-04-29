import axios from '@/config/axios';

export const createGroupConversation = async (data) => {
    try {
        const res = await axios.post('/conversations/group', data);
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
        throw new Error(error || 'Failed to get conversation');
    }
};

export const getMessageOfConversationById = async (id) => {
    try {
        const res = await axios.get(`/conversations/message/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get conversation');
    }
};

export const getOrCreateConversation = async ({ withUserId }) => {
    try {
        const res = await axios.get(`/conversations/get-or-create/${withUserId}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get-or-create conversation');
    }
};
