import axios from '@/config/axios';

export const createGroupConversation = async (data) => {
    try {
        const res = await axios.post(`/conversations/group`, data, {
            headers: {
                'Content-Type': undefined,
            },
        });
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

export const getMessageOfConversationById = async ({ id, before = '', after = '' }) => {
    try {
        const res = await axios.get(`/conversations/message/${id}?before=${before}&after=${after}`);
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

export const readLastMessage = async (id) => {
    try {
        const res = await axios.get(`/conversations/read-last-message/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to read last message of conversation');
    }
};

export const getConversationByName = async (name) => {
    try {
        const res = await axios.get(`/conversations/search?name=${name}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to search conversation');
    }
};

export const searchMessageOfConversation = async (id, query) => {
    try {
        const res = await axios.get(`/conversations/message/${id}/search?query=${query}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to search conversation');
    }
};

export const deleteUserFromConversation = async (groupId, deleteUserId) => {
    try {
        const res = await axios.post(`/conversations/group/${groupId}/delete-user`, { userId: deleteUserId });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to search conversation');
    }
};

export const changeUserRoleInConversation = async (groupId, data) => {
    try {
        const res = await axios.post(`/conversations/group/${groupId}/change-role`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to search conversation');
    }
};

export const leaveConversation = async (conversationId) => {
    try {
        const res = await axios.post(`/conversations/${conversationId}/leave`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to search conversation');
    }
};

export const findMessage = async (conversationId, messageId) => {
    try {
        const res = await axios.get(`conversations/message/${conversationId}/search/${messageId}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to find message');
    }
};

export const updateConversation = async (conversationId, data) => {
    try {
        const res = await axios.put(`conversations/${conversationId}`, data, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to update conversation');
    }
};

export const deleteGroupConversation = async (conversationId, data) => {
    try {
        const res = await axios.delete(`conversations/group/${conversationId}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to delete conversation');
    }
};

export const getForwardConversation = async (name = '') => {
    try {
        const res = await axios.get(`/conversations/forward?name=${name}`);
        return res.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch forward conversation');
    }
};
