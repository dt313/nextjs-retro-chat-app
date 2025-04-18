import { GET_ALL_NOTIFICATION, ADD_NOTIFICATION, READ_NOTIFICATION } from '@/redux/actions/notification-action';

const initialState = {
    notifications: [],
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_NOTIFICATION:
            return {
                ...state,
                notifications: action.payload,
            };

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
            };
        default:
            return state;
    }
};

export default notificationReducer;
