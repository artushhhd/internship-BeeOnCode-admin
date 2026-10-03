import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { notifyError, notifySuccess } from '@helpers/toast';
import {
  addPageTemplatesURL,
  deletePageTemplatesURL,
  editPageTemplatesStatusURL,
  editPageTemplatesURL,
  getPageTemplatesURL,
  pageTemplateDeleteStatusUrl,
} from '@api/url';
import PagesTemplatesModel from '../model/PagesTemplatesModel';

export const getPageTemplate = createAsyncThunk(
  'pageTemplates/getPageTemplate',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(getPageTemplatesURL);

      const data = await response.data;

      return data.templates.find((val) => val.id === +id);
    } catch (error) {
      return null;
    }
  }
);

const pageTemplateAdapter = createEntityAdapter({});

export const addPageTemplate = createAsyncThunk(
  'pageTemplates/addPageTemplate',
  async (pageTemplate, { dispatch, getState }) => {
    const fd = new FormData();

    fd.append('title', JSON.stringify(pageTemplate.title));

    const response = await $api.post(addPageTemplatesURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const updatePageTemplate = createAsyncThunk(
  'pageTemplates/updatePageTemplate',
  async (pageTemplate, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', pageTemplate.id);
    fd.append('title', JSON.stringify(pageTemplate.title));
    fd.append('status', pageTemplate.status);
    fd.append('delete_status', pageTemplate.delete_status);

    const response = await $api.post(editPageTemplatesURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const editPageTemplateStatus = createAsyncThunk(
  'pageTemplates/changeStatus',
  async (pageTemplate, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', pageTemplate.id);
    fd.append('status', pageTemplate.status ? 0 : 1);

    const response = await $api.post(editPageTemplatesStatusURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const removePageTemplate = createAsyncThunk(
  'pageTemplates/removePageTemplate',
  async (id, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('delete_status', 1);
    const response = await $api.post(pageTemplateDeleteStatusUrl, fd);

    const data = await response.data.message;

    return data;
  }
);

export const restorePageTemplate = createAsyncThunk(
  'pageTemplates/restorePageTemplate',
  async (id, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('delete_status', 0);
    const response = await $api.post(pageTemplateDeleteStatusUrl, fd);

    const data = await response.data.message;

    return data;
  }
);

export const deletePageTemplate = createAsyncThunk(
  'pageTemplates/deletePageTemplate',
  async (id, { dispatch, getState }) => {
    const response = await $api.delete(`${deletePageTemplatesURL}/${id}`);

    const data = await response.data.message;

    return data;
  }
);

const PageTemplateSlice = createSlice({
  name: 'pageTemplate',
  initialState: () => PagesTemplatesModel(),
  reducers: {
    newPageTemplate: (state, action) => PagesTemplatesModel(),
    setPageTemplateSelectedId: {
      reducer: (state, action) => {
        state.selectedId = action.payload;
      },
      prepare: (id) => ({ payload: id }),
    },
  },
  extraReducers: {
    [getPageTemplate.pending]: (state, action) => null,
    [getPageTemplate.fulfilled]: (state, action) => action.payload,
    [addPageTemplate.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addPageTemplate.rejected]: (state, action) => notifyError(action.payload),
    [updatePageTemplate.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updatePageTemplate.rejected]: (state, action) => notifyError(action.payload),
    [removePageTemplate.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removePageTemplate.rejected]: (state, action) => notifyError(action.payload),
    [restorePageTemplate.fulfilled]: (state, action) => notifySuccess(action.payload),
    [restorePageTemplate.rejected]: (state, action) => notifyError(action.payload),
    [deletePageTemplate.fulfilled]: (state, action) => notifySuccess(action.payload),
    [deletePageTemplate.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { newPageTemplate } = PageTemplateSlice.actions;

export const { setPageTemplateSelectedId } = PageTemplateSlice.actions;

export const selectPageTemplate = ({ PageTemplatesApp }) => PageTemplatesApp.pageTemplate;

export default PageTemplateSlice.reducer;
