import { REPLY_ATTACHMENT, REPLY_IMAGE_ATTACHMENT, REPLY_MESSAGE } from '@/config/types';

export function getNameFromConversation(message, meId) {
    if (message && message.isGroup === true) {
        return message?.name;
    } else if (message && message.isGroup === false) {
        if (message?.participants) {
            const participant = message?.participants?.find((item) => item.user._id !== meId);
            return participant ? participant.user.fullName : '';
        }
    } else {
        return '';
    }
}

export function getAvatarFromConversation(message, meId) {
    if (message && message.isGroup === true) {
        return message?.thumbnail;
    } else if (message && message.isGroup === false) {
        if (message?.participants) {
            const participant = message?.participants?.find((item) => item.user._id !== meId);
            return participant ? participant.user.avatar : '';
        }
    } else {
        return '';
    }
}

export const getReplyType = (type) => {
    switch (type) {
        case 'text':
            return REPLY_MESSAGE;
        case 'file':
            return REPLY_ATTACHMENT;
        case 'images':
            return REPLY_IMAGE_ATTACHMENT;
        default:
            return null;
    }
};

export const getReplyContent = (data) => {
    switch (data.replyType) {
        case REPLY_MESSAGE:
            return data.replyTo.content;
        case REPLY_ATTACHMENT:
            return 'Tệp đính kèm';
        case REPLY_IMAGE_ATTACHMENT:
            return 'Hình ảnh';
        default:
            return '';
    }
};

export const getReplyLabelName = (data, sender, meId) => {
    if (sender._id === meId) {
        // isSender
        if (data._id === sender._id) {
            return 'Bạn đã trả lời chính mình';
        } else {
            return `Bạn đã trả lời ${data.firstName}`;
        }
    } else {
        if (data._id === meId) {
            return `${sender.fullName} đã trả lời bạn`;
        } else {
            return `${sender.fullName} đã trả lời bạn ${data.firstName}`;
        }
    }
};
