import { combineReducers } from '@reduxjs/toolkit';
import languages from './languagesSlice';
import language from './languageSlice';

const reducer = combineReducers({
  languages,
  language,
});

export default reducer;
