import _ from 'lodash';

import {
    DELETE_CONVERSATION,
    FIND_CONVERSATION,
    INIT_CONVERSATION,
    NEW_CONVERSATION,
    READ_LAST_MESSAGE,
    RESET_COUNT,
    UPDATE_CONVERSATION,
} from '../actions/conversations-action';

const initialState = {
    list: [],
    unRead: 0,
};

let count = 0;
let prevTitle = '';

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
            const isExist = state.list.find((conv) => conv._id === conversation._id);

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

            if (count === 0) prevTitle = window.document.title;
            if (!isSender && window.document.hidden) {
                count++;
                window.document.title = `${count} tin nhắn mới`;
            }

            return {
                ...state,
                list: sorted,
                unRead: isRead ? state.unRead : state.unRead + 1,
            };

        case READ_LAST_MESSAGE:
            let wasUnread = false;
            const { conversationId, meId } = action.payload;
            const newConversations = state.list.map((conv) => {
                if (conv._id === conversationId) {
                    const alreadyRead = conv.lastMessage.readedBy.includes(meId);
                    if (!alreadyRead) wasUnread = true;
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
                unRead: wasUnread ? Math.max(state.unRead - 1, 0) : state.unRead,
            };

        case FIND_CONVERSATION:
            return {
                ...state,
                list: action.payload,
            };

        case DELETE_CONVERSATION:
            const deletedConversationId = action.payload;
            const filteredList = state.list.filter((con) => con._id !== deletedConversationId);
            return {
                ...state,
                list: filteredList,
            };

        case UPDATE_CONVERSATION:
            const updatedConversation = action.payload;

            const updateConversations = state.list.map((conv) => {
                if (conv._id === updatedConversation._id) {
                    return updatedConversation;
                }
                return conv;
            });
            return {
                ...state,
                list: updateConversations,
            };

        case RESET_COUNT:
            count = 0;
            if (!!prevTitle) {
                window.document.title = prevTitle;
            }
            return {
                ...state,
            };

        default:
            return state;
    }
};

export default conversationsReducer;
