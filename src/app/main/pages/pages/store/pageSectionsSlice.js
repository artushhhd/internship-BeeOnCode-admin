import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  getSectionURL,
  moveFileFromSectionURL,
  moveSectionFromPageURL,
  pageSectionsOrderUrl,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';

export const getPageSections = createAsyncThunk(
  'PageApp/getPageSections',
  async (id, { getState }) => {
    try {
      const response = await $api.get(`${getSectionURL}/${id}`);
      const data = await response.data;
      return { data: data.sections };
    } catch (error) {
      return null;
    }
  }
);

const sectionsAdapter = createEntityAdapter({});

export const { selectAll: selectedSections, selectById: selectSectionsById } =
  sectionsAdapter.getSelectors((state) => {
    return state.PagesApp.sections;
  });

export const changeOrderSection = createAsyncThunk(
  'pageApp/sections/changeOrderSection',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(pageSectionsOrderUrl, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const moveFileFromSection = createAsyncThunk(
  'pageApp/sections/moveFileFromSection',
  async ({ id, sectionId, type }, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('section_id', sectionId);
      fd.append('type', type);
      const res = await $api.post(moveFileFromSectionURL, fd);
      return res.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const moveSectionFromPage = createAsyncThunk(
  'pageApp/sections/moveSectionFromPage',
  async ({ id, pageId, tabId, accordionId }, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('id', id);
      if (pageId !== undefined) fd.append('page_id', pageId);
      if (tabId !== undefined) fd.append('tab_id', tabId);
      if (accordionId !== undefined) fd.append('accordion_id', accordionId);
      const res = await $api.post(moveSectionFromPageURL, fd);
      return res.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const PageSectionsSlice = createSlice({
  name: 'pageSections',
  initialState: sectionsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    cleanitem(state) {
      sectionsAdapter.setAll(state, []);
    },
    setSectionsSearchText: {
      reducer: (state, action) => {
        state.sections = [];
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getPageSections.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      sectionsAdapter.setAll(state, data);
      state.searchText = '';
    },
    [changeOrderSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderSection.rejected]: (state, action) => notifyError(action.payload),

    [moveFileFromSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [moveFileFromSection.rejected]: (state, action) => notifyError(action.payload),

    [moveSectionFromPage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [moveSectionFromPage.rejected]: (state, action) => notifyError(action.payload),
  },
});
export const { cleanitem } = PageSectionsSlice.actions;

export default PageSectionsSlice.reducer;
