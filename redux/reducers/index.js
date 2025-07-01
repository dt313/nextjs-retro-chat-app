import { combineReducers } from 'redux';

import authBoxReducer from './auth-box-reducer';
import authReducer from './auth-reducer';
import conversationsReducer from './conversations-reducer';
import imgPreviewReducer from './img-preview-reducer';
import lastConversationReducer from './last-conversation-reducer';
import notificationReducer from './notification-reducer';
import onlineUsersReducer from './online-users-reducer';
import phoneReducer from './phone-reducer';
import replyBoxReducer from './reply-box-reducer';
import toastReducer from './toast-reducer';

const rootReducer = combineReducers({
    authBox: authBoxReducer,
    replyBox: replyBoxReducer,
    imgPreview: imgPreviewReducer,
    auth: authReducer,
    notification: notificationReducer,
    toast: toastReducer,
    conversations: conversationsReducer,
    onlineUsers: onlineUsersReducer,
    lastConversation: lastConversationReducer,
    phone: phoneReducer,
});

export default rootReducer;
