import { OFFLINE, ONLINE } from '@/config/types';

import { SET_OFFLINE, SET_ONLINE } from '@/redux/actions/status-action';

const initialState = {
    status: OFFLINE,
};

const statusReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ONLINE:
            return {
                ...state,
                status: ONLINE,
            };

        case SET_OFFLINE:
            return {
                ...state,
                status: OFFLINE,
            };

        default:
            return state;
    }
};

export default statusReducer;
