const getOnlineUsers = (onlineUsers, participants) => {
    if (!onlineUsers || !Array.isArray(onlineUsers) || !participants || !Array.isArray(participants)) {
        return [];
    }

    const onlineUserIds = new Set(onlineUsers.map((user) => user));

    const userIds = participants.map((participant) => participant.user._id);

    const onlineCount = userIds.filter((participant) => onlineUserIds.has(participant)).length || 0;

    return onlineCount;
};

export default getOnlineUsers;
