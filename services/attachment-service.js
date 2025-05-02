import axios from '@/config/axios';

export const getImagesOfConversation = async (id) => {
    try {
        const res = await axios.get(`/attachments/images/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get images of conversation');
    }
};

export const getFilesOfConversation = async (id) => {
    try {
        const res = await axios.get(`/attachments/files/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to get files of conversation');
    }
};
