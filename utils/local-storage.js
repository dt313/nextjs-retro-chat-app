export const setAccessToken = (token) => {
    if (typeof window === 'undefined') return null;
    localStorage.setItem('accessToken', JSON.stringify(token));
};

export const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')) : null;
};

export const setUser = (user) => {
    if (typeof window === 'undefined') return null;
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
};
export const clearAuth = () => {
    if (typeof window === 'undefined') return null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};
