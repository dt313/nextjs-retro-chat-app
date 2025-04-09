import { combineReducers } from 'redux';
import themeReducer from './themeReducer';
import authBoxReducer from './authBoxReducer';

const rootReducer = combineReducers({ theme: themeReducer, authBox: authBoxReducer });

export default rootReducer;
