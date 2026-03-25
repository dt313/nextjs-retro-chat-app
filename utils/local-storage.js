export const setAccessToken = (token) => {
    if (typeof window !== 'undefined' && token) {
        window.localStorage.setItem('accessToken', JSON.stringify(token));
    }
};

export const getAccessToken = () => {
    if (typeof window === 'undefined') return null;

    try {
        const token = window.localStorage.getItem('accessToken');
        return token ? JSON.parse(token) : null;
    } catch (error) {
        console.error('Parse accessToken error:', error);
        return null;
    }
};

export const setUser = (user) => {
    if (typeof window !== 'undefined' && user) {
        window.localStorage.setItem('user', JSON.stringify(user));
    }
};

export const getUser = () => {
    if (typeof window === 'undefined') return null;

    try {
        const user = window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Parse user error:', error);
        return null;
    }
};

export const getTheme = () => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('theme') || 'light';
};

export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('user');
    }
};
