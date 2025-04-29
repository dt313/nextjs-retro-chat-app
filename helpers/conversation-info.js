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
