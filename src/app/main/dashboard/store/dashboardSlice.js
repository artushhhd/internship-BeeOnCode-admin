import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { getDashboardURL } from '@api/url';

export const getDashboard = createAsyncThunk('partners/get', async (page, thunkAPI) => {
  try {
    const response = await $api.get(getDashboardURL);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectDashboardData = (state) => state.dashboardApp.dashboardReducer.dashboard;

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboard: [],
    loading: false,
    error: '',
    item: { translations: [] },
  },
  extraReducers: {
    [getDashboard.pending.type]: (state) => {
      state.loading = true;
    },
    [getDashboard.fulfilled.type]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.dashboard = action.payload;
    },
    [getDashboard.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default dashboardSlice.reducer;
