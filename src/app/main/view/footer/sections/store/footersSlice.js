import {
  createAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';
import { getSectionsURL } from '@api/url';
import { addSection, removeSection, updateSection } from './footerSlice';

export const getSections = createAsyncThunk(
  'sectionsApp/sections/getSections',
  async (params, { getState }) => {
    const response = await $api.get(getSectionsURL);
    const data = await response.data;

    return { data: data.footer };
  }
);

const sectionsAdapter = createEntityAdapter({});

export const selectSearchText = ({ sectionsApp }) => {
  return sectionsApp.sections.searchText;
};

export const { selectAll: selectSections, selectById: selectSectionsById } =
  sectionsAdapter.getSelectors((state) => state.sectionsApp.sections);

export const selectFilteredSections = createSelector(
  [selectSections, selectSearchText],
  (sections, searchText) => {
    if (searchText.length === 0) {
      return sections;
    }
    return FuseUtils.filterArrayByString(sections, searchText);
  }
);

export const selectGroupedFilteredSections = createSelector(
  [selectFilteredSections],
  (sections) => {
    return sections;
  }
);

export const addType = createAction('footer/addType', (type) => {
  return {
    payload: type,
  };
});

const footersSlice = createSlice({
  name: 'sectionsApp/sections',
  initialState: sectionsAdapter.getInitialState({
    searchText: '',
    loading: false,
    newType: 'after',
  }),
  reducers: {
    setSectionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateSection.fulfilled]: sectionsAdapter.upsertOne,
    [addSection.fulfilled]: sectionsAdapter.addOne,
    [removeSection.fulfilled]: (state, action) => sectionsAdapter.removeOne(state, action.payload),
    [getSections.pending]: (state) => {
      state.loading = true;
    },
    [addType]: (state, action) => {
      state.newType = action.payload;
    },
    [getSections.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      sectionsAdapter.setAll(state, data);
      state.searchText = '';
      state.loading = false;
    },
    [getSections.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { setSectionsSearchText } = footersSlice.actions;

export default footersSlice.reducer;
