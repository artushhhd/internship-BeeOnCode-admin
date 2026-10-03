import { combineReducers } from '@reduxjs/toolkit';
import statiscticsReducer from './StatisticsSlice';

const reducer = combineReducers({
  statiscticsReducer,
});

export default reducer;
