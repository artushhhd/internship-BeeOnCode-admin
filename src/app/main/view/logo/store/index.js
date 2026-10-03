import { combineReducers } from '@reduxjs/toolkit';
import logos from './logosSlice';
import logo from './logoSlice';
import about from './aboutSlice';
import mission from './missionSlice';

const reducer = combineReducers({
  logos,
  logo,
  about,
  mission,
});

export default reducer;
