import { combineReducers } from 'redux';
import themeReducer from './theme-reducer';
import authBoxReducer from './auth-box-reducer';
import replyBoxReducer from './reply-box-reducer';
import imgPreviewReducer from './img-preview-reducer';
import authReducer from './auth-reducer';
import statusReducer from './status-reducer';
import notificationReducer from './notification-reducer';
import toastReducer from './toast-reducer';
import conversationsReducer from './conversations-reducer';
const rootReducer = combineReducers({
    theme: themeReducer,
    authBox: authBoxReducer,
    replyBox: replyBoxReducer,
    imgPreview: imgPreviewReducer,
    auth: authReducer,
    status: statusReducer,
    notification: notificationReducer,
    toast: toastReducer,
    conversations: conversationsReducer,
});

export default rootReducer;
