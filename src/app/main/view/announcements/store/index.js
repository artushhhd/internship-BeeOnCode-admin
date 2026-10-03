import { combineReducers } from '@reduxjs/toolkit';

import announcement from './announcementSlice';
import announcements from './announcementsSlice';

const reducer = combineReducers({
  announcements,
  announcement,
});

export default reducer;
