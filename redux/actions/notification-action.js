export const GET_ALL_NOTIFICATION = 'GET_ALL_NOTIFICATION';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';

export const getAllNotifications = (payload) => {
    return {
        type: GET_ALL_NOTIFICATION,
        payload: payload,
    };
};

export const addNotification = (payload) => {
    return {
        type: ADD_NOTIFICATION,
        payload: payload,
    };
};
