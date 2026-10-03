import { combineReducers } from '@reduxjs/toolkit';
import menuReducer from './menuSlice';

const reducer = combineReducers({
  menuReducer,
});

export default reducer;
