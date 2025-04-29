import { authService } from '@/services';
import { storageUtils } from '@/utils';

const refreshToken = async () => {
    try {
        const res = await authService.refreshToken();
        console.log('refresh token ', res);

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
        storageUtils.clearAuth();
        window.location.reload();
    }

    return message;
}
