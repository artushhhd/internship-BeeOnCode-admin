import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';

import { getFAQURL } from '@api/url';
import { addFAQ, removeFAQ, updateFAQ } from './FAQSlice';

export const getFAQs = createAsyncThunk('FAQsApp/FAQs/getFAQ', async (params, { getState }) => {
  const response = await $api.get(getFAQURL);
  const data = await response.data;
  return { data: data.faq };
});

const FAQAdapter = createEntityAdapter({});

export const selectSearchText = ({ FAQApp }) => {
  return FAQApp.faq?.searchText;
};

export const { selectAll: selectFaqs, selectById: selectFaqsById } = FAQAdapter.getSelectors(
  (state) => state.FAQApp.faqs
);

export const selectFilteredFaqs = createSelector(
  [selectFaqs, selectSearchText],
  (faqs, searchText = []) => {
    if (searchText.length === 0) {
      return faqs;
    }
    return FuseUtils.filterArrayByString(faqs, searchText);
  }
);

export const selectGroupedFilteredFaqs = createSelector([selectFilteredFaqs], (faqs) => {
  return faqs;
});

const FAQsSlice = createSlice({
  name: 'FAQsApp/FAQs',
  initialState: FAQAdapter.getInitialState({
    searchText: '',
    loading: false,
  }),
  reducers: {
    setFaqsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateFAQ.fulfilled]: FAQAdapter.upsertOne,
    [addFAQ.fulfilled]: FAQAdapter.addOne,
    [removeFAQ.fulfilled]: (state, action) => FAQAdapter.removeOne(state, action.payload),
    [getFAQs.pending]: (state) => {
      state.loading = true;
    },
    [getFAQs.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      FAQAdapter.setAll(state, data);
      state.searchText = '';
      state.loading = false;
    },
    [getFAQs.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { setFaqsSearchText } = FAQsSlice.actions;

export default FAQsSlice.reducer;
