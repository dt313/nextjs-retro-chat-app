export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';
export const login = (payload) => {
    return {
        type: LOGIN,
        payload: payload,
    };
};

export const logout = () => {
    return {
        type: LOGOUT,
    };
};

export const updateUser = (payload) => {
    return {
        type: UPDATE_USER,
        user: payload,
    };
};
