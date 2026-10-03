import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { addRegionURL, deleteRegionURL, editRegionURL, getRegionByIdURL } from '@api/url';
import RegionModel from '../regions/model/RegionModel';

export const getRegionById = createAsyncThunk('region/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getRegionByIdURL}/${id}`);
    return response.data.region;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addRegion = createAsyncThunk('region/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
    const response = await $api.post(addRegionURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateRegion = createAsyncThunk('region/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('title', JSON.stringify(data.title));

    const response = await $api.post(editRegionURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeRegion = createAsyncThunk('region/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteRegionURL}/${id}`);
    return {
      id,
      message: response.data.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectRegion = ({ ProjectsApp }) => ProjectsApp.region.item;

export const selectLoading = ({ ProjectsApp }) => ProjectsApp.region.loading;

const regionSlice = createSlice({
  name: 'region',
  initialState: {
    loading: false,
    error: '',
    item: null,
  },
  reducers: {
    newRegion: (state) => ({
      ...state,
      item: RegionModel(),
    }),
    resetRegion: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },
  extraReducers: {
    [getRegionById.pending]: (state, action) => {
      state.loading = true;
    },
    [getRegionById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getRegionById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [addRegion.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [addRegion.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [updateRegion.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [updateRegion.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [removeRegion.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [removeRegion.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export const { newRegion, resetRegion } = regionSlice.actions;

export default regionSlice.reducer;
