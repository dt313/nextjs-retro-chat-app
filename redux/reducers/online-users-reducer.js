import { ADD_ONLINE_USER, INIT_ONLINE_USERS, OFFLINE_USER } from '@/redux/actions/online-users-action';

const initialState = {
    list: [],
};

const onlineUsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_ONLINE_USERS:
            return {
                list: action.payload,
            };

        case ADD_ONLINE_USER:
            const isExist = state.list.some((user) => user === action.payload);

            return {
                ...state,
                list: [...state.list, ...(isExist ? [] : [action.payload])],
            };

        case OFFLINE_USER:
            return {
                ...state,
                list: state.list.filter((user) => user !== action.payload),
            };

        default:
            return state;
    }
};

export default onlineUsersReducer;
