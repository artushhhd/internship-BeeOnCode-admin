import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { addStatusURL, deleteStatusURL, editStatusURL, getStatusByIdURL } from '@api/url';
import StatusModel from '../statuses/model/StatusModel';

export const getStatusById = createAsyncThunk('status/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getStatusByIdURL}/${id}`);
    return response.data.status;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addStatus = createAsyncThunk('status/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
    fd.append('icon_id', data?.icon_id || -1);
    fd.append('is_terminate', data?.is_terminate);
    fd.append('is_completed', data?.is_completed);
    fd.append('color', data?.color);

    const response = await $api.post(addStatusURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateStatus = createAsyncThunk('status/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data?.id);
    fd.append('title', JSON.stringify(data.title));
    fd.append('icon_id', data?.icon_id || -1);
    fd.append('is_terminate', data?.is_terminate);
    fd.append('is_completed', data?.is_completed);
    fd.append('color', data?.color);

    const response = await $api.post(editStatusURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeStatus = createAsyncThunk('status/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteStatusURL}/${id}`);
    return {
      id,
      message: response.data.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectStatus = ({ ProjectsApp }) => ProjectsApp.status.item;
export const selectLoading = ({ ProjectsApp }) => ProjectsApp.status.loading;

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false,
    error: '',
    item: null,
  },
  reducers: {
    newStatus: (state) => ({
      ...state,
      item: StatusModel(),
    }),
    resetStatus: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },
  extraReducers: {
    [getStatusById.pending]: (state, action) => {
      state.loading = true;
    },
    [getStatusById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getStatusById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [addStatus.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [addStatus.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [updateStatus.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [updateStatus.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [removeStatus.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [removeStatus.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export const { newStatus, resetStatus } = statusSlice.actions;

export default statusSlice.reducer;
