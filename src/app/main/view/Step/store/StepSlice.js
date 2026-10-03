import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { notifyError, notifySuccess } from '@helpers/toast';
import {
  getStepURL,
  getStepByIdURL,
  deleteStepURL,
  editStepURL,
  addStepURL,
  changeOrderURL,
} from '@api/url';

export const getStep = createAsyncThunk('step/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getStepURL);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeStepOrder = createAsyncThunk('Step/changeOrder', async (array, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('items', JSON.stringify(array));
    const response = await $api.post(changeOrderURL, fd);
    return response.data.message || ' The order of point was successfully changed';
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getStepById = createAsyncThunk('Step/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getStepByIdURL}/${id}`);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addStep = createAsyncThunk('Step/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('file_id', JSON.stringify(data?.file_id));
    fd.append('file_id2', JSON.stringify(data?.file_id2));
    fd.append('title', JSON.stringify(data?.name));
    fd.append('description', JSON.stringify(data?.description));
    fd.append('file_name', JSON.stringify(data?.file_name));
    fd.append('file_name2', JSON.stringify(data?.file_name2));
    const response = await $api.post(addStepURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const editStep = createAsyncThunk('Step/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('file_id', JSON.stringify(data?.file_id));
    fd.append('file_id2', JSON.stringify(data?.file_id2));

    fd.append('id', data?.id);
    fd.append('title', JSON.stringify(data?.name));
    fd.append('description', JSON.stringify(data?.description));
    fd.append('file_name', JSON.stringify(data?.file_name));
    fd.append('file_name2', JSON.stringify(data?.file_name2));

    const response = await $api.post(editStepURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeStep = createAsyncThunk('step/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteStepURL}/${id}`);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const stepSlice = createSlice({
  name: 'secondaryMenu',
  initialState: {
    step: [],
    loading: false,
    error: '',
    item: [],
  },

  extraReducers: {
    [getStep.pending]: (state) => {
      state.loading = true;
    },
    [getStep.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.step = action.payload;
    },
    [getStep.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeStepOrder.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [changeStepOrder.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [getStepById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
    },
    [getStepById.rejected]: (state, action) => {
      state.error = action.payload;
    },

    [addStep.pending.type]: (state) => {
      state.loading = true;
    },
    [addStep.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [addStep.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [editStep.pending.type]: (state) => {
      state.loading = true;
    },
    [editStep.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [editStep.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [removeStep.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [removeStep.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export default stepSlice.reducer;
