import { combineReducers } from '@reduxjs/toolkit';
import news from './newsSlice';
import newsItem from './newsItemSlice';

const reducer = combineReducers({
  news,
  newsItem,
});

export default reducer;
