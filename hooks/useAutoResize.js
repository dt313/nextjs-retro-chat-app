'use client';

import { useEffect, useRef } from 'react';

function useAutoResize(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current.style.height = 'auto';
        ref.current.style.height = ref.current.scrollHeight + 'px';
    }, [value]);

    return ref;
}

export default useAutoResize;
