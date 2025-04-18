import axios from 'axios';
import { storageUtils } from '@/utils';
const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const NO_AUTH_HEADER_URLS = [];
const OPTION_AUTH_HEADER_URLS = [];
instance.interceptors.request.use(
    async function (config) {
        config.headers.Authorization = `Bearer ${storageUtils.getAccessToken()}`;
        return config;
    },

    function (error) {
        console.log(error);
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    function (response) {
        if (response.data) {
            return response.data;
        } else {
            // Nếu code khác 1000, trả lỗi về cho người dùng
            return Promise.reject({
                message: response?.data?.message || 'Lỗi máy chủ',
                code: response?.data?.code,
            });
        }
    },
    function (error) {
        let customError = {
            message: 'Đã xảy ra lỗi không xác định',
            code: -1,
        };

        if (error.code === 'ERR_NETWORK') {
            customError.message = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.';
        } else if (error.response) {
            const { status, data } = error.response;
            customError.code = status;
            customError.message = data?.message || `Lỗi từ máy chủ (${status})`;
        } else if (error.message) {
            customError.message = error.message;
        }

        console.error('Response error:', customError);
        return Promise.reject(customError);
    },
);

export default instance;
