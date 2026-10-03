import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  addMenuURL,
  deleteMenuURL,
  editMenuURL,
  getMenuByIdURL,
  getMenuURL,
  orderMenuURL,
  placeMenuURL,
} from '@api/url';
import createTreeViewData from '@helpers/createTreeViewData';
import { notifyError, notifySuccess } from '@helpers/toast';

export const getMenu = createAsyncThunk('menu/get', async (language, thunkAPI) => {
  try {
    const response = await $api.get(getMenuURL);
    const a = createTreeViewData(response?.data.menu, language);
    return a;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeMenuOrder = createAsyncThunk('menu/changeOrder', async (array, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('menu', JSON.stringify(array));
    const response = await $api.post(orderMenuURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeMenuPlace = createAsyncThunk('menu/changePlace', async (array, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', JSON.stringify(array));
    const response = await $api.post(placeMenuURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getMenuById = createAsyncThunk('menu/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getMenuByIdURL}/${id}`);
    return response.data.menu;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addMenu = createAsyncThunk('menu/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    if (data?.parent_id) {
      fd.append('parent_id', data?.parent_id);
    }
    fd.append('file_id', data?.file_id || 0);
    // fd.append('icon', data?.icon);
    fd.append('name', JSON.stringify(data?.name));
    if (data?.checked) {
      fd.append('link', data?.link);
    } else if (data?.newPageChecked) {
      fd.append('page_id', -1);
      fd.append('page_slug', data.page_slug);
      fd.append('page_title', JSON.stringify(data?.page_title));
    } else {
      fd.append('page_id', data.pageId);
    }

    const response = await $api.post(addMenuURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateMenu = createAsyncThunk('menu/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);

    // if (data.icon) {
    //   fd.append('icon', data.icon);
    // }

    fd.append('file_id', data?.file_id || 0);

    if (data.parent_id) {
      fd.append('parent_id', data.parent_id);
    }

    fd.append('name', JSON.stringify(data.name));
    if (data?.checked) {
      fd.append('link', data?.link);
    } else if (data?.newPageChecked) {
      fd.append('page_id', -1);
      fd.append('page_slug', data.page_slug);
      fd.append('page_title', JSON.stringify(data?.page_title));
    } else {
      fd.append('page_id', data.pageId);
    }
    const response = await $api.post(editMenuURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeMenu = createAsyncThunk('menu/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteMenuURL}/${id}`);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menu: [],
    loading: false,
    error: '',
    item: { translations: [] },
    model: null,
    path: [],
  },
  extraReducers: {
    [getMenu.rejected.type]: (state) => {
      state.loading = true;
    },
    [getMenu.fulfilled.type]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.menu = action.payload;
    },
    [getMenu.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeMenuOrder.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [changeMenuOrder.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [changeMenuPlace.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [changeMenuPlace.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [getMenuById.fulfilled.type]: (state, action) => {
      state.error = '';
      state.item = action.payload;
    },
    [getMenuById.rejected.type]: (state, action) => {
      state.error = action.payload;
    },

    [addMenu.pending.type]: (state) => {
      state.loading = true;
    },
    [addMenu.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
      state.loading = false;
      state.model = action.payload.newMenu;
    },
    [addMenu.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [updateMenu.pending.type]: (state) => {
      state.loading = true;
    },
    [updateMenu.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
      state.loading = false;
      state.model = action.payload.newMenu;
    },
    [updateMenu.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [removeMenu.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [removeMenu.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export default menuSlice.reducer;
