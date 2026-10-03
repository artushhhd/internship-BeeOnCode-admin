import { combineReducers } from '@reduxjs/toolkit';
import slider from './sliderSlice';
import slide from './slideSlice';

const reducer = combineReducers({
  slider,
  slide,
});

export default reducer;
