import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getPageTemplatesURL } from '@api/url';

export const getPageTemplates = createAsyncThunk(
  'PageTemplatesApp/pageTemplates/getPageTemplates',
  async (params, { getState }) => {
    const response = await $api.get(getPageTemplatesURL);
    const data = await response.data;
    return { data: data.templates };
  }
);

export const getInactivePageTemplates = createAsyncThunk(
  'PageTemplatesApp/pageTemplates/getPageTemplates/inactive',
  async (params, { getState }) => {
    const response = await $api.get(`${getPageTemplatesURL}/inactive`);
    const data = await response.data;
    return { data: data.templates };
  }
);

const pageTemplatesAdapter = createEntityAdapter({});

const PageTemplatesSlice = createSlice({
  name: 'pageTemplates',
  initialState: pageTemplatesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setPageTemplatesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getPageTemplates.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      pageTemplatesAdapter.setAll(state, data);
      state.searchText = '';
    },
    [getInactivePageTemplates.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      pageTemplatesAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const selectPageTemplatesSearchText = (state) => {
  return state.PageTemplatesApp.pageTemplates.searchText;
};

export const { selectAll: selectPageTemplates } = pageTemplatesAdapter.getSelectors((state) => {
  return state.PageTemplatesApp.pageTemplates;
});

export const { setPageTemplatesSearchText } = PageTemplatesSlice.actions;

export default PageTemplatesSlice.reducer;
