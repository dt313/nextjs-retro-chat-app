import {
    CONVERSATION_PARTICIPANT_ROLE_ADMIN,
    CONVERSATION_PARTICIPANT_ROLE_CREATOR,
    CONVERSATION_PARTICIPANT_ROLE_MEMBER,
    REPLY_ATTACHMENT,
    REPLY_IMAGE_ATTACHMENT,
    REPLY_MESSAGE,
} from '@/config/types';

export function getNameFromConversation(conversation, meId) {
    if (conversation && conversation.isGroup === true) {
        return conversation?.name;
    } else if (conversation && conversation.isGroup === false) {
        if (conversation?.participants) {
            const participant = conversation?.participants?.find((item) => item.user._id !== meId);
            return participant ? participant.user.fullName : '';
        }
    } else {
        return '';
    }
}

export function getEmailFromConversation(conversation, meId) {
    if (conversation && conversation.isGroup === true) {
        return '';
    } else if (conversation && conversation.isGroup === false) {
        if (conversation?.participants) {
            const participant = conversation?.participants?.find((item) => item.user._id !== meId);
            return participant ? participant.user.email : '';
        }
    } else {
        return '';
    }
}

export function getUsernameFromConversation(conversation, meId) {
    if (conversation && conversation.isGroup === true) {
        return '';
    } else if (conversation && conversation.isGroup === false) {
        if (conversation?.participants) {
            const participant = conversation?.participants?.find((item) => item.user._id !== meId);
            return participant ? participant.user.username : '';
        }
    } else {
        return '';
    }
}

export function getAvatarFromConversation(conversation, meId) {
    if (conversation && conversation.isGroup === true) {
        return conversation?.thumbnail;
    } else if (conversation && conversation.isGroup === false) {
        if (conversation?.participants) {
            const participant = conversation?.participants?.find((item) => item.user._id !== meId);
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
        case 'image':
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
            return `${sender.fullName} đã trả lời ${data._id === sender._id ? 'chính mình' : data.firstName}`;
        }
    }
};

export const getUserRole = (role) => {
    switch (role) {
        case CONVERSATION_PARTICIPANT_ROLE_CREATOR:
            return 'Chủ nhóm';
        case CONVERSATION_PARTICIPANT_ROLE_ADMIN:
            return 'Quản trị viên';
        case CONVERSATION_PARTICIPANT_ROLE_MEMBER:
            return 'Thành viên';
        default:
            return 'Thành viên';
    }
};
