export const OPEN_IMG_PREVIEW = 'OPEN_IMG_PREVIEW';
export const CLOSE_IMG_PREVIEW = 'CLOSE_IMG_PREVIEW';
export const OPEN_VIDEO_PREVIEW = 'OPEN_VIDEO_PREVIEW';

export const openImgPreview = ({ currentIndex, listImages }) => {
    return {
        type: OPEN_IMG_PREVIEW,
        payload: { currentIndex, listImages },
    };
};

export const openVideoPreview = ({ currentIndex, listImages }) => {
    return {
        type: OPEN_VIDEO_PREVIEW,
        payload: { currentIndex, listImages },
    };
};
export const closeImgPreview = () => {
    return {
        type: CLOSE_IMG_PREVIEW,
    };
};
