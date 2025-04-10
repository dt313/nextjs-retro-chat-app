import { combineReducers } from 'redux';
import themeReducer from './theme-reducer';
import authBoxReducer from './auth-box-reducer';
import replyBoxReducer from './reply-box-reducer';

const rootReducer = combineReducers({ theme: themeReducer, authBox: authBoxReducer, replyBox: replyBoxReducer });

export default rootReducer;
