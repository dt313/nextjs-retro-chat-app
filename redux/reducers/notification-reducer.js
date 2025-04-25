import { NOTIFICATION_FRIEND_REQUEST } from '@/config/types';
import {
    GET_ALL_NOTIFICATION,
    ADD_NOTIFICATION,
    READ_NOTIFICATION,
    CHANGE_TYPE_NOTIFICATION,
} from '@/redux/actions/notification-action';

const initialState = {
    notifications: [],
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, ...action.payload],
            };

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
            };

        case CHANGE_TYPE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.map((notification) =>
                    notification._id === action.payload.notificationId
                        ? { ...notification, type: action.payload.type }
                        : notification,
                ),
            };
        default:
            return state;
    }
};

export default notificationReducer;
