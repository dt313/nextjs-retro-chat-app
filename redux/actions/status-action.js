export const SET_ONLINE = 'SET_ONLINE';
export const SET_OFFLINE = 'SET_OFFLINE';

export const setOnline = (payload) => {
    return {
        type: SET_ONLINE,
        payload,
    };
};

export const setOffline = () => {
    return {
        type: SET_OFFLINE,
    };
};
