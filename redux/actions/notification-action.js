export const GET_ALL_NOTIFICATION = 'GET_ALL_NOTIFICATION';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const LOAD_MORE_NOTIFICATION = 'LOAD_MORE_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const CHANGE_TYPE_NOTIFICATION = 'CHANGE_TYPE_NOTIFICATION';
export const RESET_NOTIFICATION_COUNT = 'RESET_NOTIFICATION_COUNT';

export const initNotifications = (payload) => {
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

export const loadNotification = (payload) => {
    return {
        type: LOAD_MORE_NOTIFICATION,
        payload: payload,
    };
};

export const changeTypeNotification = (payload) => {
    return {
        type: CHANGE_TYPE_NOTIFICATION,
        payload: payload,
    };
};

export const readNotification = (payload) => {
    return {
        type: READ_NOTIFICATION,
        payload,
    };
};

export const resetNotificationCount = () => {
    return {
        type: RESET_COUNT,
    };
};
