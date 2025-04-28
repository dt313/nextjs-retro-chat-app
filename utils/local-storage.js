export const setAccessToken = (token) => {
    if (typeof window !== 'undefined') window.localStorage.setItem('accessToken', JSON.stringify(token));
};

export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('accessToken')
            ? JSON.parse(window.localStorage.getItem('accessToken'))
            : null;
    }
};

export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('user', JSON.stringify(user));
    }
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null;
    }
};
export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('user');
    }
};
