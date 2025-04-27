import { v4 as uuidv4 } from 'uuid';
export const DELETE_TOAST = 'DELETE_TOAST';
export const ADD_TOAST = 'ADD_TOAST';
export const DURATION_DELETE = 'DURATION_DELETE';
export const createToast = ({ type = 'info', content = '' }) => {
    return {
        id: uuidv4(),
        type,
        content,
        isOpen: true,
    };
};

export function deleteByDuration() {
    return {
        type: DURATION_DELETE,
    };
}

export function deleteToast(id) {
    return {
        type: DELETE_TOAST,
        payload: id,
    };
}

export function addToast(payload) {
    return {
        type: ADD_TOAST,
        payload: payload,
    };
}
