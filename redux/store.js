import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';
const store = configureStore({
    reducer,
});

export default store;
