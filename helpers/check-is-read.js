const checkIsRead = (readUserList, meId) => {
    const isRead = readUserList.some((id) => id === meId);
    return isRead;
};

export default checkIsRead;
