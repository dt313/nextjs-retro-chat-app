import _ from 'lodash';

import {
    FIND_CONVERSATION,
    INIT_CONVERSATION,
    NEW_CONVERSATION,
    READ_LAST_MESSAGE,
} from '../actions/conversations-action';

const initialState = {
    list: [],
    unRead: 0,
};

const conversationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_CONVERSATION:
            const conversations = action.payload.conversations;
            const unReadedConversation = conversations.filter(
                (c) => !c.lastMessage.readedBy.includes(action.payload.meId),
            );

            return {
                ...state,
                list: action.payload.conversations,
                unRead: unReadedConversation.length,
            };
        case NEW_CONVERSATION:
            const { conversation } = action.payload;
            const [isExist] = state.list.filter((conv) => conv._id === conversation._id);

            let isRead = false;
            let sorted = state.list;

            const isSender = conversation.lastMessage.sender._id === action.payload.meId;

            if (!!isExist) {
                const updated = state.list.map((conv) => (conv._id === conversation._id ? conversation : conv));
                sorted = _.orderBy(updated, ['lastMessage.sentAt'], ['desc']);
                isRead = !isExist.lastMessage.readedBy.includes(action.payload.meId);
            } else {
                const newConversations = [...state.list, conversation];
                sorted = _.orderBy(newConversations, ['lastMessage.sentAt'], ['desc']);
                isRead = conversation.lastMessage.readedBy.includes(action.payload.meId);
            }

            if (isSender) {
                isRead = true;
            }

            return {
                ...state,
                list: sorted,
                unRead: isRead ? state.unRead : state.unRead + 1,
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
                ...state,
                list: newConversations,
                unRead: state.unRead - 1,
            };

        case FIND_CONVERSATION:
            return {
                ...state,
                list: action.payload,
            };

        default:
            return state;
    }
};

export default conversationsReducer;
