export const INIT_CONVERSATION = 'INIT_CONVERSATION';
export const NEW_CONVERSATION = 'NEW_CONVERSATION';
export const READ_LAST_MESSAGE = 'READ_LAST_MESSAGE';
export const initConversation = (payload) => {
    return {
        type: INIT_CONVERSATION,
        payload,
    };
};

export const newConversation = (payload) => {
    return {
        type: NEW_CONVERSATION,
        payload,
    };
};

export const readLastMessage = (payload) => {
    return {
        type: READ_LAST_MESSAGE,
        payload,
    };
};
