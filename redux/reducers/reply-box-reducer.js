import { OPEN_REPLY_BOX, CLOSE_REPLY_BOX } from '../actions/reply-box-action';

const initialState = {
    isOpen: false,
    data: {},
};

const replyBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_REPLY_BOX:
            return {
                isOpen: true,
                data: action.payload,
            };

        case CLOSE_REPLY_BOX:
            return {
                isOpen: false,
                data: {},
            };

        default:
            return state;
    }
};

export default replyBoxReducer;
