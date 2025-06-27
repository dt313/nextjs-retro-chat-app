import eventBus from '@/config/emit';

import { storageUtils } from '@/utils';

let reconnectTimeout = null;
let socket = null;

export const initSocket = (token = null) => {
    if ((socket && socket.readyState === WebSocket.OPEN) || !token) return socket;

    socket = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}`,
    );

    socket.addEventListener('open', (event) => {
        console.log('WS connected');
        if (window) {
            token = storageUtils.getAccessToken();
        }

        setTimeout(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'AUTH', token }));
            }
        }, 200); // Delay 200ms
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);

        const { type, data } = message;

        switch (type) {
            case 'online_users':
                const { onlineUsers } = data;
                if (onlineUsers) {
                    eventBus.emit('online-users', onlineUsers);
                }
                break;
            case 'new_online_user':
                const { onlineUser } = data;
                if (onlineUser) {
                    eventBus.emit('new_online_user', onlineUser);
                }
                break;
            case 'offline_user':
                const { offlineUser } = data;
                if (offlineUser) {
                    eventBus.emit('offline_user', offlineUser);
                }
                break;
            case 'notification':
                eventBus.emit('notification', data.notification);
                break;

            case 'message':
                const { message, conversationId } = data;
                if (message && conversationId) {
                    eventBus.emit(`message-${conversationId}`, message);
                }
                break;

            case 'reaction':
                const { reaction, messageId } = data;
                if (reaction && messageId) {
                    eventBus.emit(`reaction-${messageId}`, reaction);
                }
                break;

            case 'cancel-reaction':
                const { cancelReaction, cancelMessageId } = data;
                if (cancelReaction && cancelMessageId) {
                    eventBus.emit(`cancel-reaction-${cancelMessageId}`, cancelReaction);
                }
                break;
            case 'typing':
                const { conversationId: typingConversationId, typingUser } = data;
                if (typingConversationId && typingUser) {
                    eventBus.emit(`typing-${typingConversationId}`, typingUser);
                }
                break;
            case 'no-typing':
                const { conversationId: noTypingConversationId, typingUser: noTypingUser } = data;

                if (noTypingConversationId && noTypingUser) {
                    eventBus.emit(`no-typing-${noTypingConversationId}`, noTypingUser);
                }
                break;

            case 'last-conversation':
                const { conversation: lastConversation } = data;
                if (lastConversation) {
                    eventBus.emit(`last-conversation`, lastConversation);
                    eventBus.emit(`conversation-update-${lastConversation._id}`, lastConversation);
                }
                break;

            case 'conversation-update':
                const { conversation: updateConversation, conversationId: updateConversationId } = data;
                if (updateConversation) {
                    eventBus.emit(`conversation-update-${updateConversationId}`, updateConversation);
                }
                break;

            case 'incoming_call':
                if (data) {
                    eventBus.emit('incoming_call', data);
                }
                break;

            case 'incoming_video_call':
                if (data) {
                    eventBus.emit('incoming_video_call', data);
                }
                break;

            case 'ice_candidate':
                if (data) {
                    eventBus.emit('ice_candidate', data);
                }
                break;

            case 'offer':
                if (data) {
                    eventBus.emit('offer', data);
                }
                break;

            case 'answer':
                if (data) {
                    eventBus.emit('answer', data);
                }
                break;

            case 'call_reject':
                if (data) {
                    eventBus.emit('call_reject', data);
                }
                break;

            case 'call_end':
                if (data) {
                    eventBus.emit('call_end', data);
                }
                break;

            default:
                console.warn('? unknow message type', type);
        }
    });

    socket.addEventListener('close', (event) => {
        console.log('WS server closed ');
        if (window) {
            token = token || storageUtils.getAccessToken();
        }

        reconnect(token);
    });

    socket.addEventListener('error', (event) => {
        console.log('Websocket Error: ', event);
        socket.close();
    });

    return socket;
};

function reconnect(token) {
    socket = null;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(() => {
        initSocket(token);
    }, 3000);
}

export const getSocket = () => socket;
