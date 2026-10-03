import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getRegionsURL, orderRegionURL } from '@api/url';
import { addRegion, removeRegion, updateRegion } from './regionSlice';

const regionsAdapter = createEntityAdapter({});

export const { selectAll: selectRegions, selectById: selectRegionById } =
  regionsAdapter.getSelectors(({ ProjectsApp }) => ProjectsApp.regions);

export const getRegions = createAsyncThunk('regions/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getRegionsURL);
    return response?.data.regions;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeRegionOrder = createAsyncThunk(
  'regions/changeOrder',
  async (array = [], thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderRegionURL, fd);
      const data = array.map((val) => selectRegionById(thunkAPI.getState(), val));
      return {
        data,
        message: response.data.message,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const regionSlice = createSlice({
  name: 'regions',
  initialState: regionsAdapter.getInitialState({
    searchText: '',
    loading: false,
    error: '',
  }),
  reducers: {
    setRegionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getRegions.pending]: (state) => {
      state.loading = true;
    },
    [getRegions.fulfilled]: (state, action) => {
      const data = action.payload;
      regionsAdapter.setAll(state, data);
      state.searchText = '';
      state.error = '';
      state.loading = false;
    },
    [getRegions.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeRegionOrder.fulfilled]: (state, action) => {
      const { data } = action.payload;
      regionsAdapter.setAll(state, data);
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [changeRegionOrder.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [addRegion.fulfilled]: (state, action) => {
      regionsAdapter.addOne(state, action.payload.data);
    },
    [updateRegion.fulfilled]: (state, action) => {
      regionsAdapter.upsertOne(state, action.payload.data);
    },
    [removeRegion.fulfilled]: (state, action) => {
      regionsAdapter.removeOne(state, action.payload.id);
    },
  },
});
export const { setRegionsSearchText } = regionSlice.actions;
export const selectRegionsSearchText = ({ ProjectsApp }) => ProjectsApp.regions.searchText;
export const selectRegionsLoading = ({ ProjectsApp }) => ProjectsApp.regions.loading;

export default regionSlice.reducer;
