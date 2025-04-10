export const OPEN_REPLY_BOX = 'OPEN_REPLY_BOX';
export const CLOSE_REPLY_BOX = 'CLOSE_REPLY_BOX';

export const openReplyBox = (data) => {
    return {
        type: OPEN_REPLY_BOX,
        payload: data,
    };
};

export const closeReplyBox = () => {
    return {
        type: CLOSE_REPLY_BOX,
    };
};
