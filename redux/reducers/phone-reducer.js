import { CALL_STATES, PHONE_ACTIONS } from '../actions/phone-action';

const initialState = {
    isOpen: false,
    status: null,
    sender: null,
    receiver: null,
    callDirection: null, // 'outgoing' or 'incoming'
    callStartTime: null,
    callDuration: 0,
};

const phoneReducer = (state = initialState, action) => {
    switch (action.type) {
        case PHONE_ACTIONS.CALL_START:
            return {
                ...state,
                isOpen: true,
                status: CALL_STATES.CALLING,
                sender: action.payload.sender,
                receiver: action.payload.receiver,
                callDirection: 'outgoing',
                callStartTime: new Date().getTime(),
            };

        case PHONE_ACTIONS.CALL_INCOMING:
            return {
                ...state,
                isOpen: true,
                status: CALL_STATES.RINGING,
                sender: action.payload.sender,
                receiver: action.payload.receiver,
                callDirection: 'incoming',
                callStartTime: new Date().getTime(),
            };

        case PHONE_ACTIONS.CALL_ANSWER:
            return {
                ...state,
                status: CALL_STATES.CONNECTING,
            };

        case PHONE_ACTIONS.CALL_STATUS_CHANGE:
            return {
                ...state,
                status: action.payload,
            };

        case PHONE_ACTIONS.CALL_END:
        case PHONE_ACTIONS.CALL_REJECTED:
            return {
                ...initialState,
            };

        default:
            return state;
    }
};

export default phoneReducer;
