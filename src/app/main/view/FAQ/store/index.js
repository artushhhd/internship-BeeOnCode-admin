import { combineReducers } from '@reduxjs/toolkit';

import faq from './FAQSlice';
import faqs from './FAQsSlice';

const reducer = combineReducers({
  faqs,
  faq,
});

export default reducer;
