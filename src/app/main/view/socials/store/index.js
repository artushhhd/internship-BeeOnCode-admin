import { combineReducers } from '@reduxjs/toolkit';
import socials from './socialsSlice';
import social from './socialSlice';

const reducer = combineReducers({
  socials,
  social,
});

export default reducer;
