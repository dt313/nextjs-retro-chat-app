import axios from 'axios';
import { storageUtils } from '@/utils';
import handleHttpError from '@/helpers/handle-http-error';
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
        if (config.url.startsWith('/auth')) {
            return config;
        }
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
            return Promise.reject({
                message: response?.data?.message || 'Lỗi máy chủ',
                code: response?.data?.code,
            });
        }
    },
    function (error) {
        const errorMessage = handleHttpError(error.response.data);

        return Promise.reject(errorMessage);
    },
);

export default instance;
