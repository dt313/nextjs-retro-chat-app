const getLastMessageContent = (message, meId) => {
    const { sender, type, content } = message;
    if (!type || type === 'null' || !sender) {
        return '';
    }
    const isMe = sender._id === meId;
    const name = isMe ? 'Bạn' : sender.fullName;
    switch (type) {
        case 'text':
            return `${name} : ${content}`;
        case 'file':
            return `${name} đã gửi tệp đính kèm`;
        case 'image':
            return `${name} đã gửi ảnh`;
        case 'file-image':
            return `${name} đã gửi tệp đính kèm và ảnh`;
        case 'text-file':
            return `${name} đã gửi tin nhắn và tệp đính kèm`;
        case 'text-image':
            return `${name} đã gửi tin nhắn và ảnh`;
        case 'text-image-file':
            return `${name} đã gửi tin nhắn và tệp đính kèm`;
        case 'reaction':
            return `${name} đã bày tỏ cảm xúc 1 tin nhắn`;
        case 'delete':
            return `${name} đã xóa 1 tin nhắn`;
        default:
            return `${name} đã gửi 1 tin nhắn`;
    }
};

export default getLastMessageContent;
