import axios from '@/config/axios';

export const getGroups = async (q) => {
    try {
        const res = await axios.get(`/groups?q=${q}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};

export const getGroupById = async (id) => {
    try {
        const res = await axios.get(`/groups/${id}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};

export const joinGroup = async (id, data) => {
    try {
        const res = await axios.post(`/groups/join/${id}`, data);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch users');
    }
};

export const getInvitationUsers = async (groupId, searchValue) => {
    try {
        const res = await axios.get(`/groups/invitation-users/${groupId}?name=${searchValue}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch invitation users');
    }
};

export const getMembersOfGroup = async (groupId, name) => {
    try {
        const res = await axios.get(`/groups/${groupId}/members?name=${name}`);
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to fetch members of group');
    }
};
