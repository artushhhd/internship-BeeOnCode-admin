import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';

const reducer = combineReducers({
  dashboardReducer,
});

export default reducer;
