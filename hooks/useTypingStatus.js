import { useEffect, useRef } from 'react';

import { getSocket } from '@/config/ws';
import { useRouter } from 'next/router';

export default function useTypingStatus({ conversationId, userId, isTyping }) {
    const socketRef = useRef;

    const sendNoTyping = () => {
        const socket = getSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: 'NO_TYPING',
                    data: { conversationId, userId },
                }),
            );
        }
    };

    useEffect(() => {
        socketRef.current = getSocket();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isTyping) {
                sendNoTyping();
            }
        };

        const handleBeforeUnload = () => {
            if (isTyping) sendNoTyping();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleBeforeUnload);
        };
    }, [conversationId, userId, isTyping]);
}
