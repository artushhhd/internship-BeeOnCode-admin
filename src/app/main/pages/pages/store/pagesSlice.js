import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getPagesURL } from '@api/url';

export const getPages = createAsyncThunk('pageApp/getPages', async (params, { getState }) => {
  const response = await $api.get(getPagesURL);
  const data = await response.data;
  return { data: data.pages };
});

export const getInactivePages = createAsyncThunk(
  'pageApp/getPages/inactive',
  async (params, { getState }) => {
    const response = await $api.get(`${getPagesURL}/inactive`);
    const data = await response.data;
    return { data: data.pages };
  }
);

const pagesAdapter = createEntityAdapter({});

export const selectPagesSearchText = (state) => {
  return state.PagesApp.pages.searchText;
};

export const { selectAll: selectPages, selectById: selectpagesById } = pagesAdapter.getSelectors(
  (state) => {
    return state.PagesApp.pages;
  }
);

const PagesSlice = createSlice({
  name: 'pages',
  initialState: pagesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setPagesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getPages.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      pagesAdapter.setAll(state, data);
      state.searchText = '';
    },
    [getInactivePages.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      pagesAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setPagesSearchText } = PagesSlice.actions;

export default PagesSlice.reducer;
