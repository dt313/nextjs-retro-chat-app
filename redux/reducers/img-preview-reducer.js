import { CLOSE_IMG_PREVIEW, OPEN_IMG_PREVIEW } from '../actions/img-preview-action';

const initialState = {
    isOpen: false,
    currentIndex: 0,
    listImages: [],
};

const imgPreviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_IMG_PREVIEW:
            return {
                isOpen: true,
                currentIndex: action.payload.currentIndex,
                listImages: action.payload.listImages,
            };

        case CLOSE_IMG_PREVIEW:
            return {
                isOpen: false,
                currentIndex: 0,
                listImages: [],
            };

        default:
            return state;
    }
};

export default imgPreviewReducer;
