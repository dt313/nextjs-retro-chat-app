export const UPDATE_LAST_CONVERSATION = 'UPDATE_LAST_CONVERSATION';

export const updateLastConversation = (payload) => {
    return {
        type: UPDATE_LAST_CONVERSATION,
        payload: payload,
    };
};
