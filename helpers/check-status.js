const checkStatus = (userId, onlineUserList) => {
    if (!userId || !onlineUserList) {
        return false;
    }

    return onlineUserList.includes(userId);
};

export default checkStatus;
