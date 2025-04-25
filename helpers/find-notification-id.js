const getNotificationId = (list, sender, type) => {
    const notification = list.find((item) => item.sender._id === sender && item.type === type);
    return notification ? notification._id : null;
};

export default getNotificationId;
