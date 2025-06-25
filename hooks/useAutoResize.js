'use client';

import { useEffect, useRef } from 'react';

function useAutoResize(value) {
    const ref = useRef();

    useEffect(() => {
        if (value === undefined || value === null || value === '') {
            ref.current.style.height = window.getComputedStyle(ref.current).minHeight;
            return;
        }
        ref.current.style.height = 'auto';
        ref.current.style.height = ref.current.scrollHeight + 'px';
    }, [value]);

    return ref;
}

export default useAutoResize;
