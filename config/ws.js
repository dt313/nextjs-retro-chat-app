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

            default:
                console.warn('? unknow message type', type);
        }
    });

    socket.addEventListener('close', (event) => {
        console.log('WS server closed');
    });

    return socket;
};

export const getSocket = () => socket;
