import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  addPagesURL,
  deletePagesURL,
  editPagesStatusURL,
  editPagesURL,
  getPagesURL,
  pageDeleteStatusUrl,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import PagesModel from '../model/PagesModel';

export const getPage = createAsyncThunk('page/getPage', async (id, { dispatch, getState }) => {
  try {
    const response = await $api.get(getPagesURL);

    const data = await response.data;

    return data.pages.find((val) => val.id === +id);
  } catch (error) {
    return null;
  }
});

export const addPage = createAsyncThunk('page/addPage', async (page, { dispatch, getState }) => {
  const fd = new FormData();
  fd.append('type', page.type);
  fd.append('title', JSON.stringify(page.title));
  fd.append('slug', page.slug);
  if (page.template_id) fd.append('template_id', page.template_id);

  const response = await $api.post(addPagesURL, fd);

  const data = await response.data.message;

  return data;
});

export const updatePage = createAsyncThunk(
  'page/updatePage',
  async (page, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', page.id);
    fd.append('type', page.type);
    fd.append('title', JSON.stringify(page.title));
    fd.append('slug', page.slug);
    fd.append('keyword', JSON.stringify(page.keyword));
    fd.append('meta', JSON.stringify(page?.meta));
    fd.append('status', page.status);
    fd.append('delete_status', page.delete_status);
    fd.append('is_template', page.is_template || 0);

    const response = await $api.post(editPagesURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const editPageStatus = createAsyncThunk(
  'page/changeStatus',
  async (page, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', page.id);
    fd.append('status', page.status ? 0 : 1);

    const response = await $api.post(editPagesStatusURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const removePage = createAsyncThunk(
  'page/removePage',
  async (id, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('delete_status', 1);
    const response = await $api.post(pageDeleteStatusUrl, fd);

    const data = await response.data.message;

    return data;
  }
);

export const restorePage = createAsyncThunk(
  'page/restorePage',
  async (id, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('delete_status', 0);
    const response = await $api.post(pageDeleteStatusUrl, fd);

    const data = await response.data.message;

    return data;
  }
);

export const deletePage = createAsyncThunk(
  'page/deletePage',
  async (id, { dispatch, getState }) => {
    const response = await $api.delete(`${deletePagesURL}/${id}`);

    const data = await response.data.message;

    return data;
  }
);

const PageSlice = createSlice({
  name: 'page',
  initialState: () => PagesModel(),
  reducers: {
    newPage: (state, action) => PagesModel(),
    setPageSelectedId: {
      reducer: (state, action) => {
        state.selectedId = action.payload;
      },
      prepare: (id) => ({ payload: id }),
    },
  },
  extraReducers: {
    [getPage.pending]: (state, action) => null,
    [getPage.fulfilled]: (state, action) => action.payload,
    [addPage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addPage.rejected]: (state, action) => notifyError(action.payload),
    [updatePage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updatePage.rejected]: (state, action) => notifyError(action.payload),
    [editPageStatus.fulfilled]: (state, action) => notifySuccess(action.payload),
    [editPageStatus.rejected]: (state, action) => notifyError(action.payload),
    [removePage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removePage.rejected]: (state, action) => notifyError(action.payload),
    [restorePage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [restorePage.rejected]: (state, action) => notifyError(action.payload),
    [deletePage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [deletePage.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { newPage } = PageSlice.actions;

export const { setPageSelectedId } = PageSlice.actions;

export const selectPage = ({ PagesApp }) => PagesApp.page;

export default PageSlice.reducer;
