export const CALL_STATES = {
    CALLING: 'calling',
    RINGING: 'ringing',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    REJECTED: 'rejected',
    ENDED: 'ended',
};

export const VISIBILITY = {
    HIDE: 'HIDE',
    VISIBLE: 'VISIBLE',
    SMALL: 'SMALL',
};

export const CONNECTING_STATUS = CALL_STATES.CONNECTING;

// Action Types
export const PHONE_ACTIONS = {
    CALL_START: 'CALL_START',
    CALL_ANSWER: 'CALL_ANSWER',
    CALL_END: 'CALL_END',
    CALL_STATUS_CHANGE: 'CALL_STATUS_CHANGE',
    CALL_INCOMING: 'CALL_INCOMING',
    CALL_REJECTED: 'CALL_REJECTED',
    CHANGE_VISIBILITY: 'CHANGE_VISIBILITY',
};

// Action Creators
export const call = (payload) => ({
    type: PHONE_ACTIONS.CALL_START,
    payload,
});

export const answerCall = () => ({
    type: PHONE_ACTIONS.CALL_ANSWER,
});

export const rejectCall = () => ({
    type: PHONE_ACTIONS.CALL_REJECTED,
});

export const stop = () => ({
    type: PHONE_ACTIONS.CALL_END,
});

export const changeStatus = (status) => ({
    type: PHONE_ACTIONS.CALL_STATUS_CHANGE,
    payload: status,
});

export const incomingCall = (payload) => ({
    type: PHONE_ACTIONS.CALL_INCOMING,
    payload,
});

export const upgradeToVideo = (payload) => ({
    type: PHONE_ACTIONS.VIDEO_UPGRADE,
    payload,
});

export const changeVisibility = (payload) => ({
    type: PHONE_ACTIONS.CHANGE_VISIBILITY,
    payload,
});
