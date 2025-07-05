import { useEffect, useRef } from 'react';

function useMentionObserver(editorRef, onMentionDeleted) {
    const observerRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;

        observerRef.current = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('mention-user')) {
                        const mentionId = node.getAttribute('data-mention-id');
                        onMentionDeleted?.(mentionId);
                    }
                });
            }
        });

        observerRef.current.observe(editorRef.current, {
            childList: true,
            subtree: true,
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [editorRef, onMentionDeleted]);
}

export default useMentionObserver;
