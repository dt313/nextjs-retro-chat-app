import {
    ADD_NOTIFICATION,
    CHANGE_TYPE_NOTIFICATION,
    GET_ALL_NOTIFICATION,
    LOAD_MORE_NOTIFICATION,
    READ_NOTIFICATION,
    RESET_NOTIFICATION_COUNT,
} from '@/redux/actions/notification-action';

const initialState = {
    notifications: [],
    unRead: 0,
};

let count = 0;
let prevTitle = '';

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
            if (count === 0) prevTitle = window.document.title;
            if (window.document.hidden) {
                count++;
                window.document.title = `${count} thông báo mới`;
            }
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

        case RESET_NOTIFICATION_COUNT:
            count = 0;
            if (!!prevTitle) {
                window.document.title = prevTitle;
            }
            return state;

        default:
            return state;
    }
};

export default notificationReducer;
