import { authService } from '@/services';

import { storageUtils } from '@/utils';

const refreshToken = async () => {
    try {
        const res = await authService.refreshToken();

        const { accessToken } = res;
        if (accessToken) {
            storageUtils.setAccessToken(accessToken);
            window.location.reload();
        }
    } catch (err) {
        console.log(err);
    }
};

export default function handleHttpError(error) {
    const { status, message } = error;

    console.log('handleHttpError', error);

    if (status === 401 && message === 'Access Token Expired') {
        refreshToken();
        return;
    }

    if (
        (status === 401 && message === 'Unauthorized') ||
        message === 'Refresh Token Expired' ||
        message === 'Invalid Refresh Token' ||
        message === 'Invalid Access Token'
    ) {
        console.log('-------');
        storageUtils.clearAuth();
        window.location.href = '/';
    }

    return message;
}
