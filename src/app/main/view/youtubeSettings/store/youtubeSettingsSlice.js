import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { notifyError, notifySuccess } from '@helpers/toast';
import {
  changeStatusYoutubeSettingsURL,
  getYoutubeSettingsURL,
  syncYoutubeSettingsURL,
  youtubeSettingsOrderURL,
} from '@api/url';

export const getYoutubeSettings = createAsyncThunk('youtubeSettings/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getYoutubeSettingsURL);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeYoutubeSettingsOrder = createAsyncThunk(
  'youtubeSettings/changeOrder',
  async (array, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(youtubeSettingsOrderURL, fd);
      return response.data.message || ' The order of point was successfully changed';
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const changeStatusYoutubeSettings = createAsyncThunk(
  'youtubeSettings/changeStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('status', status);
      const response = await $api.post(changeStatusYoutubeSettingsURL, fd);
      return {
        message: response.data.message || ' The order of point was successfully changed',
        id,
        status,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const syncYoutubeSettings = createAsyncThunk(
  'youtubeSettings/syncYoutubeSettings',
  async (_, thunkAPI) => {
    try {
      const response = await $api.get(syncYoutubeSettingsURL);
      return response.data.message || 'Synced';
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const selectYoutubeSettings = (state) => state.YoutubeSettingsApp.videos;
export const selectYoutubeSettingsSyncLoading = (state) => state.YoutubeSettingsApp.syncLoading;

const youtubeSettingsSlice = createSlice({
  name: 'youtubeSettings',
  initialState: {
    videos: [],
    loading: false,
    syncLoading: false,
    error: '',
  },

  extraReducers: {
    [getYoutubeSettings.pending]: (state) => {
      state.loading = true;
    },
    [getYoutubeSettings.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.videos = action.payload.youtubeVideos;
    },
    [getYoutubeSettings.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeYoutubeSettingsOrder.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [changeYoutubeSettingsOrder.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [changeStatusYoutubeSettings.fulfilled.type]: (state, action) => {
      state.videos = [...state.videos].map((v) =>
        v.id !== action.payload.id ? v : { ...v, status: action.payload.status }
      );
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [changeStatusYoutubeSettings.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [syncYoutubeSettings.pending.type]: (state, action) => {
      state.syncLoading = true;
      state.error = '';
      notifySuccess(action.payload);
    },
    [syncYoutubeSettings.fulfilled.type]: (state, action) => {
      state.syncLoading = false;
      state.error = '';
      notifySuccess(action.payload);
    },
    [syncYoutubeSettings.rejected.type]: (state, action) => {
      state.syncLoading = false;
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export default youtubeSettingsSlice.reducer;
