export const INIT_CONVERSATION = 'INIT_CONVERSATION';
export const NEW_CONVERSATION = 'NEW_CONVERSATION';
export const READ_LAST_MESSAGE = 'READ_LAST_MESSAGE';
export const FIND_CONVERSATION = 'FIND_CONVERSATION';
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION';
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

export const findConversation = (payload) => {
    return {
        type: FIND_CONVERSATION,
        payload,
    };
};

export const deleteConversation = (payload) => {
    return {
        type: DELETE_CONVERSATION,
        payload,
    };
};
