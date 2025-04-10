export const OPEN_AUTH_BOX = 'OPEN_AUTH_BOX';
export const CLOSE_AUTH_BOX = 'CLOSE_AUTH_BOX';
export const LOGIN_AUTH_BOX = 'Đăng nhập';
export const REGISTER_AUTH_BOX = 'Đăng kí';
export const FORGET_PASSWORD_BOX = 'Quên mật khẩu';

export const openAuthBox = (type) => {
    return {
        type: OPEN_AUTH_BOX,
        payload: type,
    };
};

export const closeAuthBox = () => {
    return {
        type: CLOSE_AUTH_BOX,
    };
};
