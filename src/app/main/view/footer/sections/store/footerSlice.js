import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { $api } from '@api/http';
import {
  getSectionsURL,
  addSectionURL,
  editSectionURL,
  orderSectionUrl,
  deleteSectionURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import FooterModel from '../model/FooterModel';

export const getSection = createAsyncThunk(
  'sectionsApp/task/getSection',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(getSectionsURL);
      return response.data.footer.find((val) => val.id === +id);
    } catch (error) {
      history.push({ pathname: `view/section` });
      return null;
    }
  }
);

export const addSection = createAsyncThunk(
  'sectionsApp/sections/addSection',
  async (section, translationLanguages, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('file_id', section?.file_id || 0);
      fd.append('title', JSON.stringify(section?.title));
      fd.append('content', JSON.stringify(createEditorDataForDB(section?.content)));
      fd.append('border', section?.border);
      fd.append('type', section?.type);
      section?.link.forEach((val) => {
        fd.append('name[]', val.name);
        fd.append('pages_id[]', val?.page_id ? val?.page_id : '');
        fd.append('link[]', val?.url ? val.url : '');
        fd.append('language_id[]', val.lang_id);
        fd.append('is_name_visible', 1);
        fd.append('cover[]', val?.cover ? val.cover.id : 0);
      });
      const response = await $api.post(addSectionURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const updateSection = createAsyncThunk(
  'sectionsApp/sections/updateSection',
  async (section, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('file_id', section?.file_id || 0);
      fd.append('id', section?.id);
      fd.append('title', JSON.stringify(section?.title));
      fd.append('border', section?.border);
      fd.append('type', section?.type);
      fd.append('content', JSON.stringify(createEditorDataForDB(section?.content)));
      section?.link.forEach((val) => {
        fd.append('name[]', val.name);
        fd.append('pages_id[]', val?.page_id ? val?.page_id : '');
        fd.append('link[]', val?.url ? val.url : '');
        fd.append('language_id[]', val.lang_id);
        fd.append('is_name_visible', 1);
        fd.append('cover[]', val?.cover ? val.cover.id : 0);
      });
      const response = await $api.post(editSectionURL, fd);
      return 'The footer section Successfully edited';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const changeOrderSection = createAsyncThunk(
  'sectionsApp/sections/changeOrderSection',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(orderSectionUrl, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const removeSection = createAsyncThunk(
  'sectionsApp/sections/removeSection',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deleteSectionURL}/${id}`);
      return 'The footer section Successfully deleted';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const selectSection = ({ sectionsApp }) => {
  return sectionsApp.section;
};

const footerSlice = createSlice({
  name: 'sectionsApp/section',
  initialState: null,
  reducers: {
    newSection: (state, action) => FooterModel(),
    resetSection: () => null,
  },
  extraReducers: {
    [getSection.pending]: (state, action) => null,
    [getSection.fulfilled]: (state, action) => action.payload,
    [addSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addSection.rejected]: (state, action) => notifyError(action.payload),
    [updateSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateSection.rejected]: (state, action) => notifyError(action.payload),
    [removeSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeSection.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderSection.fulfilled]: (state, action) => notifySuccess(action.payload),
  },
});

export const { resetSection, newSection } = footerSlice.actions;

export default footerSlice.reducer;
