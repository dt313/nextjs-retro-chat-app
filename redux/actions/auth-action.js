export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
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
