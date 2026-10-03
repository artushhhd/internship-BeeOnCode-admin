import { combineReducers } from '@reduxjs/toolkit';

import service from './serviceSlice';
import services from './servicesSlice';

const reducer = combineReducers({
  services,
  service,
});

export default reducer;
