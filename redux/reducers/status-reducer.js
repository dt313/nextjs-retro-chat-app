import { SET_ONLINE, SET_OFFLINE } from '@/redux/actions/status-action';
import { ONLINE, OFFLINE } from '@/config/types';

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
