import { combineReducers } from '@reduxjs/toolkit';
import translationReducer from './TranslationsSlice';

const reducer = combineReducers({
  translationReducer,
});

export default reducer;
