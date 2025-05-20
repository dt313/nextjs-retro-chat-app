const getTime = (date) => {
    const newDate = new Date(date);

    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
};

export default getTime;
