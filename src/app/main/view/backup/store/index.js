import { combineReducers } from '@reduxjs/toolkit';
import backupReducer from './backupSlice';

const reducer = combineReducers({
  backupReducer,
});

export default reducer;
