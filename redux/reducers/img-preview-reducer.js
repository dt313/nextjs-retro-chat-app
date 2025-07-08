import { CLOSE_IMG_PREVIEW, OPEN_IMG_PREVIEW, OPEN_VIDEO_PREVIEW } from '../actions/img-preview-action';

const initialState = {
    isOpen: false,
    currentIndex: 0,
    listImages: [],
    isVideo: false,
};

const imgPreviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_IMG_PREVIEW:
            return {
                ...state,
                isOpen: true,
                currentIndex: action.payload.currentIndex,
                listImages: action.payload.listImages,
                isVideo: false,
            };

        case OPEN_VIDEO_PREVIEW:
            return {
                isOpen: true,
                currentIndex: action.payload.currentIndex,
                listImages: action.payload.listImages,
                isVideo: true,
            };

        case CLOSE_IMG_PREVIEW:
            return {
                isOpen: false,
                currentIndex: 0,
                listImages: [],
                isVideo: false,
            };

        default:
            return state;
    }
};

export default imgPreviewReducer;
