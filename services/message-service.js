import axios from '@/config/axios';

export const create = async (id, data) => {
    try {
        const res = await axios.post(`/messages/to/${id}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to create message');
    }
};
