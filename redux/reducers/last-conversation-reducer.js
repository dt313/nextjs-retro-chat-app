import { UPDATE_LAST_CONVERSATION } from '../actions/last-conversation-action';

export { UPDATE_LAST_CONVERSATION } from '../actions/last-conversation-action';
const initialState = {
    conversationId: null,
};

const lastConversationReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LAST_CONVERSATION:
            return {
                ...state,
                conversationId: action.payload,
            };
        default:
            return state;
    }
};

export default lastConversationReducer;
