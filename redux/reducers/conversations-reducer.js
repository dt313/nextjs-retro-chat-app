import _ from 'lodash';

import { INIT_CONVERSATION, NEW_CONVERSATION, READ_LAST_MESSAGE } from '../actions/conversations-action';

const initialState = {
    list: [],
};

const conversationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_CONVERSATION:
            return {
                list: action.payload,
            };
        case NEW_CONVERSATION:
            const conversation = action.payload;
            const isExist = state.list.some((conv) => conv._id === conversation._id);
            let sorted = state.list;
            if (isExist) {
                const updated = state.list.map((conv) => (conv._id === conversation._id ? conversation : conv));
                sorted = _.orderBy(updated, ['lastMessage.sentAt'], ['desc']);
            } else {
                const newConversations = [...state.list, conversation];
                sorted = _.orderBy(newConversations, ['lastMessage.sentAt'], ['desc']);
            }
            return {
                list: sorted,
            };

        case READ_LAST_MESSAGE:
            const { conversationId, meId } = action.payload;
            const newConversations = state.list.map((conv) => {
                if (conv._id === conversationId) {
                    const alreadyRead = conv.lastMessage.readedBy.includes(meId);
                    const updatedLastMessage = {
                        ...conv.lastMessage,
                        readedBy: alreadyRead ? conv.lastMessage.readedBy : [...conv.lastMessage.readedBy, meId],
                    };
                    return {
                        ...conv,
                        lastMessage: updatedLastMessage,
                    };
                }
                return conv;
            });
            return {
                list: newConversations,
            };

        default:
            return state;
    }
};

export default conversationsReducer;
