import { OPEN_REPLY_BOX, CLOSE_REPLY_BOX } from '../actions/reply-box-action';

const initialState = {
    isOpenReplyBox: false,
    replyData: {},
};

const replyBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_REPLY_BOX:
            return {
                isOpenReplyBox: true,
                replyData: action.payload,
            };

        case CLOSE_REPLY_BOX:
            return {
                isOpenReplyBox: false,
                replyData: {},
            };

        default:
            return state;
    }
};

export default replyBoxReducer;
