import { authService } from '@/services';
import { storageUtils } from '@/utils';

const refreshToken = async () => {
    try {
        const res = await authService.refreshToken();
        console.log('refresh token ', res);

        const { accessToken } = res;
        if (accessToken) {
            storageUtils.setAccessToken(accessToken);
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
    return error_message;
}
