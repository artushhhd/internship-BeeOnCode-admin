import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getPageTemplateSectionURL, PageTemplatesSectionsOrderURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';

export const getPageTemplateSections = createAsyncThunk(
  'pageTemplateApp/pageTemplates/getPageTemplateSections',
  async (id, { getState }) => {
    try {
      const response = await $api.get(`${getPageTemplateSectionURL}/${id}`);
      const data = await response.data;
      return { data: data.sections };
    } catch (error) {
      return null;
    }
  }
);

const sectionsAdapter = createEntityAdapter({});

export const { selectAll: selectedTemplateSections, selectById: selectSectionsById } =
  sectionsAdapter.getSelectors((state) => {
    return state.PageTemplatesApp.pageTemplateSections;
  });

export const changeOrderSection = createAsyncThunk(
  'pageTemplateApp/sections/changeOrderSection',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(PageTemplatesSectionsOrderURL, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const PageTemplateSectionsSlice = createSlice({
  name: 'pageTemplateSections',
  initialState: sectionsAdapter.getInitialState({
    searchText: '',
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
    [getPageTemplateSections.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      sectionsAdapter.setAll(state, data);
      state.searchText = '';
    },
    [changeOrderSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderSection.rejected]: (state, action) => notifyError(action.payload),
  },
});

export default PageTemplateSectionsSlice.reducer;
