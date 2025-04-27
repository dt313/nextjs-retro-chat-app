const initialState = {
    toasts: [],
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TOAST':
            return { ...state, toasts: [...state.toasts, action.payload] };
        case 'DELETE_TOAST':
            return {
                ...state,
                toasts: state.toasts.length > 0 && state.toasts.filter((t) => t.id !== action.payload),
            };
        case 'DURATION_DELETE':
            return {
                ...state,
                toasts: state.toasts.length > 0 && state.toasts.slice(1),
            };
        default:
            return state;
    }
};

export default toastReducer;
