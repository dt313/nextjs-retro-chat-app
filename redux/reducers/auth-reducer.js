import { storageUtils } from '@/utils';

import { LOGIN, LOGOUT } from '../actions/auth-action';

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

        default:
            return state;
    }
};

export default authBoxReducer;
