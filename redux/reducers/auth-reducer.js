import { LOGIN, LOGOUT } from '../actions/auth-action';
import { storageUtils } from '@/utils';

const initialState = {
    isAuthenticated: !!storageUtils.getAccessToken() ? true : false,
    user: storageUtils.getUser() || {},
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
