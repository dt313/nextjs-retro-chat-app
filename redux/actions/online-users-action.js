export const INIT_ONLINE_USERS = 'INIT_ONLINE_USERS';
export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const OFFLINE_USER = 'OFFLINE_USER';
export const initOnlineUsers = (users) => {
    return {
        type: INIT_ONLINE_USERS,
        payload: users,
    };
};

export const addOnlineUser = (user) => {
    return {
        type: ADD_ONLINE_USER,
        payload: user,
    };
};

export const deleteUser = (user) => {
    return {
        type: OFFLINE_USER,
        payload: user,
    };
};
