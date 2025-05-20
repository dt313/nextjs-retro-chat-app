import {
    CONVERSATION_PARTICIPANT_ROLE_ADMIN,
    CONVERSATION_PARTICIPANT_ROLE_CREATOR,
    CONVERSATION_PARTICIPANT_ROLE_MEMBER,
    REPLY_ATTACHMENT,
    REPLY_IMAGE_ATTACHMENT,
    REPLY_MESSAGE,
} from '@/config/types';

export function getNameFromConversation(conversation, meId, isFullName = false) {
    if (conversation && conversation.isGroup === true) {
        return conversation?.name;
    } else if (conversation && conversation.isGroup === false) {
        if (conversation?.participants) {
            const participant = conversation?.participants?.find((item) => item.user._id !== meId);
            if (isFullName) return participant ? participant.user.fullName : '';

            return participant ? participant.nickname || participant.user.fullName : '';
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

export function getRoleFromConversation(conversation, meId) {
    const participant = conversation?.participants?.find((item) => item.user._id === meId);
    return participant.role;
}

export function getNickNameFromConversation(conversation, meId) {
    if (conversation.isGroup) return '';
    const participant = conversation?.participants?.find((item) => item.user._id !== meId);
    return participant.nickname || participant.user.fullName;
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
            const participant = conversation?.participants?.find((item) => item.user?._id !== meId);
            return participant ? participant.user?.avatar : '';
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

export const getMessageNotification = (mes, meId, target) => {
    const isMe = mes.sender._id === meId;

    const updatedName = isMe ? 'Bạn' : mes.sender.fullName;

    switch (mes.content) {
        case 'nickname-updated':
            return `${updatedName} đã đặt biệt danh cho ${isMe ? target : 'bạn'}`;
        case 'group-name-updated':
            return `${updatedName} đã thay đổi tên nhóm`;
        case 'background-url-updated':
            return `${updatedName} đã thay đổi hình nền của cuộc hội thoại`;
        case 'group-description-updated':
            return `${updatedName} đã thay đổi đoạn giới thiệu của nhóm`;
        case 'group-rules-updated':
            return `${updatedName} đã thay đổi quy định của nhóm`;
        case 'group-thumbnail-updated':
            return `${updatedName} đã thay đổi ảnh đại diện của nhóm`;
        case 'group-password-updated':
            return `${updatedName} đã thay đổi mật khẩu của nhóm`;
        case 'pinned-message-removed':
            return `${updatedName} đã bỏ ghim tin nhắn`;
        case 'pinned-message-added':
            return `${updatedName} đã ghim tin nhắn`;
        case 'group-joined':
            return `${updatedName} đã tham gia nhóm`;
        case 'group-left':
            return `${updatedName} đã rời nhóm`;

        default:
            return '';
    }
};
