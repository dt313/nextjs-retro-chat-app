import { useEffect } from 'react';

export default function useDragAndDrop({ containerRef, onDropFiles, onDragStateChange }) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onDragStateChange?.(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!container.contains(e.relatedTarget)) {
                onDragStateChange?.(false);
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onDragStateChange?.(false);

            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) {
                onDropFiles?.(droppedFiles);
            }
        };

        container.addEventListener('dragenter', handleDragEnter);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);

        return () => {
            container.removeEventListener('dragenter', handleDragEnter);
            container.removeEventListener('dragleave', handleDragLeave);
            container.removeEventListener('dragover', handleDragOver);
            container.removeEventListener('drop', handleDrop);
        };
    }, [containerRef, onDropFiles, onDragStateChange]);
}
