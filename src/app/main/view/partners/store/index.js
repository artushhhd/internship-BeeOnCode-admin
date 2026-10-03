import { combineReducers } from '@reduxjs/toolkit';
import partnersReducer from './partnersSlice';

const reducer = combineReducers({
  partnersReducer,
});

export default reducer;
