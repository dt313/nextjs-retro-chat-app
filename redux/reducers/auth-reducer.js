import { storageUtils } from '@/utils';

import { LOGIN, LOGOUT, UPDATE_USER } from '../actions/auth-action';

const initialState = {
    isAuthenticated: false,
    user: {},
};

const authBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            storageUtils.setAccessToken(action.payload.accessToken);
            storageUtils.setUser(action.payload.user);
            return {
                isAuthenticated: true,
                user: action.payload.user,
            };
        case LOGOUT:
            storageUtils.clearAuth();
            return {
                isAuthenticated: false,
                user: {},
            };
        case UPDATE_USER:
            return {
                ...state,
                user: action.user,
            };

        default:
            return state;
    }
};

export default authBoxReducer;
