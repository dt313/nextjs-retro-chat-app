import { useEffect } from 'react';

import { CALL_STATES } from '@/redux/actions/phone-action';

function useNotifyCallEndOnReload(isCalling, status, notifyCallEnd) {
    useEffect(() => {
        if (!isCalling) return;

        const handleUnload = () => {
            if (status === CALL_STATES.CONNECTED) notifyCallEnd();
            else notifyCallEnd(true);
        };

        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, [isCalling, notifyCallEnd]);
}

export default useNotifyCallEndOnReload;
