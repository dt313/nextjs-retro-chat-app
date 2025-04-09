import { OPEN_AUTH_BOX, CLOSE_AUTH_BOX, LOGIN_AUTH_BOX } from '../actions/authBoxAction';

const initialState = {
    type: LOGIN_AUTH_BOX,
    isOpen: false,
};

const authBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_AUTH_BOX':
            return {
                type: action.payload,
                isOpen: true,
            };
        case 'CLOSE_AUTH_BOX':
            return {
                ...state,
                isOpen: false,
            };

        default:
            return state;
    }
};

export default authBoxReducer;
