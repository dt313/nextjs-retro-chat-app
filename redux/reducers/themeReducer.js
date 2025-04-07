import { TOGGLE_THEME } from '../actions/themeAction';

const initialState = {
    theme: 'light',
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return {
                ...state,
                theme: state.theme === 'light' ? 'dark' : 'light',
            };

        default:
            return state;
    }
};

export default toastReducer;
