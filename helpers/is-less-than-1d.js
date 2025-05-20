const isLessThan1D = (date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const readAt = new Date(date);

    const timeDiff = now - readAt;

    return timeDiff < oneDay;
};

export default isLessThan1D;
