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
                    eventBus.emit(`message-${conversationId}`, data.message);
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
