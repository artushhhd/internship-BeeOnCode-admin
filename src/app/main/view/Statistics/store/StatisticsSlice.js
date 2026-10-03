import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { notifyError, notifySuccess } from '@helpers/toast';
import {
  getStatisticsAll,
  getStatisticById,
  addStatisticsURL,
  editStatisticURL,
  statisticDeleteURL,
  statisticIsPubleshed,
  statisticsOrderURL,
} from '@api/url';

export const getStatistics = createAsyncThunk('step/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getStatisticsAll);

    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeStatisticOrder = createAsyncThunk(
  'Step/changeOrder',
  async (array, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(statisticsOrderURL, fd);
      return response.data.message || ' The order of point was successfully changed';
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getStatisticId = createAsyncThunk('Statistic/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getStatisticById}/${id}`);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const statusStatistic = createAsyncThunk(
  'statistic/status',
  async ({ id, isPublished }, thunkAPI) => {
    try {
      // const fd = new FormData();
      // fd.append('id', id);

      const response = await $api.post(statisticIsPubleshed, {
        id,
        is_published: isPublished === 1 ? 0 : 1,
      });
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addStatistics = createAsyncThunk('Statistic/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
    fd.append('icon_id', data?.icon_id || 0);
    fd.append('status_id', JSON.stringify(data?.status_id) || 1);
    fd.append('is_amount', +data?.checkBox === 3 ? 1 : 0);
    fd.append('is_count', +data?.checkBox === 1 ? 1 : 0);

    fd.append('is_sponsor', +data?.checkBox === 2 ? 1 : 0);

    const response = await $api.post(addStatisticsURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const editStatistic = createAsyncThunk('Statistic/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data?.id);
    fd.append('title', JSON.stringify(data?.title));
    fd.append('icon_id', data?.icon_id || 0);
    fd.append('is_amount', +data?.checkBox === 3 ? 1 : 0);
    fd.append('is_count', +data?.checkBox === 1 ? 1 : 0);

    fd.append('is_sponsor', +data?.checkBox === 2 ? 1 : 0);
    fd.append('status_id', JSON.stringify(data?.status_id));

    const response = await $api.post(editStatisticURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeStatistics = createAsyncThunk('statisitic/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${statisticDeleteURL}/${id}`);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: {
    statistics: [],
    loading: false,
    error: '',
    item: [],
  },

  extraReducers: {
    [getStatistics.pending]: (state) => {
      state.loading = true;
    },
    [getStatistics.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.statistics = action.payload;
    },
    [getStatistics.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // [changeSecondaryMenuOrder.fulfilled.type]: (state, action) => {
    //   state.error = '';
    //   notifySuccess(action.payload);
    // },
    // [changeSecondaryMenuOrder.rejected.type]: (state, action) => {
    //   state.error = action.payload;
    //   notifyError(action.payload);
    // },

    [getStatisticId.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
    },
    [getStatisticId.rejected]: (state, action) => {
      state.error = action.payload;
    },

    [addStatistics.pending.type]: (state) => {
      state.loading = true;
    },
    [addStatistics.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [addStatistics.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },
    [statusStatistic.fulfilled]: (state, action) => {
      notifySuccess(action.payload);
    },

    [editStatistic.pending]: (state) => {
      state.loading = true;
    },
    [editStatistic.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [editStatistic.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [removeStatistics.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [removeStatistics.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export default statisticsSlice.reducer;
