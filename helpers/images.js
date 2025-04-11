const reshapeImages = (list, index) => {
    if (!Array.isArray(list) || index < 0 || index >= list.length) return list;
    return list.slice(index).concat(list.slice(0, index));
};

export { reshapeImages };
