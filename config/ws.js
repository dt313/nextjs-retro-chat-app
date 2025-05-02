import eventBus from '@/config/emit';
let socket = null;

export const initSocket = (token) => {
    if (socket) return socket;
    socket = new WebSocket('ws://macbook.com:3333');

    socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify({ type: 'AUTH', token }));
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        console.log('message from server ws ');

        const { type, data } = message;
        console.log('Message Type ', type);

        switch (type) {
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
                console.log('no - typing', noTypingUser, noTypingConversationId);
                if (noTypingConversationId && noTypingUser) {
                    eventBus.emit(`no-typing-${noTypingConversationId}`, noTypingUser);
                }
                break;

            case 'last-conversation':
                const { conversation: lastConversation } = data;
                console.log('last-conversation', lastConversation);
                if (lastConversation) {
                    eventBus.emit(`last-conversation`, lastConversation);
                }
                break;

            default:
                console.warn('? unknow message type', type);
        }
    });

    socket.addEventListener('close', (event) => {
        console.log('WS server closed');
    });

    socket.addEventListener('error', (event) => {
        console.log('Websocket Error: ', event);
    });

    return socket;
};

export const getSocket = () => socket;
