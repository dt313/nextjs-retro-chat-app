import { combineReducers } from 'redux';

import authBoxReducer from './auth-box-reducer';
import authReducer from './auth-reducer';
import conversationsReducer from './conversations-reducer';
import imgPreviewReducer from './img-preview-reducer';
import notificationReducer from './notification-reducer';
import replyBoxReducer from './reply-box-reducer';
import statusReducer from './status-reducer';
import themeReducer from './theme-reducer';
import toastReducer from './toast-reducer';

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
