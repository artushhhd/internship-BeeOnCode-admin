import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { addAreaURL, deleteAreaURL, editAreaURL, getAreaByIdURL } from '@api/url';
import AreaModel from '../areas/model/AreaModel';

export const getAreaById = createAsyncThunk('area/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getAreaByIdURL}/${id}`);
    return response.data.area;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addArea = createAsyncThunk('area/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
    fd.append('icon_id', data?.icon_id || 0);
    fd.append('slug', data?.slug);
    fd.append('type', data?.type);
    fd.append('page_id', data?.page_id || 0);
    const response = await $api.post(addAreaURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateArea = createAsyncThunk('area/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('title', JSON.stringify(data.title));
    fd.append('icon_id', JSON.stringify(data?.icon_id || 0));
    fd.append('slug', data?.slug);
    fd.append('type', data?.type);
    fd.append('page_id', data?.page_id);

    const response = await $api.post(editAreaURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeArea = createAsyncThunk('area/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteAreaURL}/${id}`);
    return {
      id,
      message: response.data.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectArea = ({ ProjectsApp }) => ProjectsApp.area.item;
export const selectLoading = ({ ProjectsApp }) => ProjectsApp.area.loading;

const areaSlice = createSlice({
  name: 'area',
  initialState: {
    loading: false,
    error: '',
    item: null,
  },
  reducers: {
    newArea: (state) => ({
      ...state,
      item: AreaModel(),
    }),
    resetArea: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },
  extraReducers: {
    [getAreaById.pending]: (state, action) => {
      state.loading = true;
    },
    [getAreaById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getAreaById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [addArea.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [addArea.rejected]: (state, action) => {
      state.error = action.payload;
      notifySuccess(action.payload);
    },

    [updateArea.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [updateArea.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [removeArea.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [removeArea.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export const { newArea, resetArea } = areaSlice.actions;

export default areaSlice.reducer;
