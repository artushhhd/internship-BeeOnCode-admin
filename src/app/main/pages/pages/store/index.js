import { combineReducers } from '@reduxjs/toolkit';
import pages from './pagesSlice';
import page from './pageSlice';
import sections from './pageSectionsSlice';
import section from './pageSectionSlice';

const reducer = combineReducers({
  pages,
  page,
  sections,
  section,
});

export default reducer;
