import { combineReducers } from '@reduxjs/toolkit';
import sections from './footersSlice';
import section from './footerSlice';

const reducer = combineReducers({
  sections,
  section,
});

export default reducer;
