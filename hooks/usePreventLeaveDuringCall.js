'use client';

import { useEffect } from 'react';

function usePreventLeaveDuringCall(isCalling) {
    useEffect(() => {
        if (!isCalling) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isCalling]);

    return;
}

export default usePreventLeaveDuringCall;
