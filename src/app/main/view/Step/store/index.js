import { combineReducers } from '@reduxjs/toolkit';
import secondaryMenuReducer from './StepSlice';

const reducer = combineReducers({
  secondaryMenuReducer,
});

export default reducer;
