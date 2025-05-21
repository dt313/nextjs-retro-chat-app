import { NOTIFICATION_FRIEND_REQUEST } from '@/config/types';

import {
    ADD_NOTIFICATION,
    CHANGE_TYPE_NOTIFICATION,
    GET_ALL_NOTIFICATION,
    LOAD_MORE_NOTIFICATION,
    READ_NOTIFICATION,
} from '@/redux/actions/notification-action';

const initialState = {
    notifications: [],
    unRead: 0,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_NOTIFICATION:
            const unReadNotification = action.payload.filter((n) => !n.isRead).length;
            return {
                ...state,
                notifications: action.payload,
                unRead: unReadNotification,
            };

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unRead: state.unRead + 1,
            };

        case LOAD_MORE_NOTIFICATION:
            const newNotification = [...state.notifications, ...action.payload];
            const newUnReadNotification = newNotification.filter((n) => !n.isRead).length;

            return {
                ...state,
                notifications: newNotification,
                unRead: newUnReadNotification,
            };

        case CHANGE_TYPE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.map((notification) =>
                    notification._id === action.payload.notificationId
                        ? { ...notification, type: action.payload.type, isRead: true }
                        : notification,
                ),
                unRead: state.unRead > 0 ? state.unRead - 1 : 0,
            };

        case READ_NOTIFICATION:
            const id = action.payload;

            return {
                ...state,
                notifications: state.notifications.map((notification) =>
                    notification._id === id ? { ...notification, isRead: true } : notification,
                ),
                unRead: state.unRead > 0 ? state.unRead - 1 : 0,
            };

        default:
            return state;
    }
};

export default notificationReducer;
