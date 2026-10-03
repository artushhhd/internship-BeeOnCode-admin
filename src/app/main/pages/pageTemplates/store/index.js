import { combineReducers } from '@reduxjs/toolkit';
import pageTemplates from './pageTemplatesSlice';
import pageTemplate from './pageTemplateSlice';
import pageTemplateSections from './pageTemplateSectionsSlice';
import pageTemplateSection from './pageTemplateSectionSlice';

const reducer = combineReducers({
  pageTemplates,
  pageTemplate,
  pageTemplateSections,
  pageTemplateSection,
});

export default reducer;
