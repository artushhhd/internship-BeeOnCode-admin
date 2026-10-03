import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getStatusesURL, orderStatusURL } from '@api/url';
import { addStatus, removeStatus, updateStatus } from './statusSlice';

const statusesAdapter = createEntityAdapter({});

export const { selectAll: selectStatuses, selectById: selectStatusById } =
  statusesAdapter.getSelectors(({ ProjectsApp }) => ProjectsApp.statuses);

export const getStatuses = createAsyncThunk('statuses/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getStatusesURL);
    return response?.data.statuses;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeStatusOrder = createAsyncThunk(
  'status/changeOrder',
  async (array = [], thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderStatusURL, fd);
      const data = array.map((val) => selectStatusById(thunkAPI.getState(), val));
      return {
        data,
        message: response.data.message,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const statusSlice = createSlice({
  name: 'statuses',
  initialState: statusesAdapter.getInitialState({
    searchText: '',
    loading: false,
    error: '',
  }),
  reducers: {
    setStatusesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getStatuses.pending]: (state) => {
      state.loading = true;
    },
    [getStatuses.fulfilled]: (state, action) => {
      const data = action.payload;
      statusesAdapter.setAll(state, data);
      state.searchText = '';
      state.error = '';
      state.loading = false;
    },
    [getStatuses.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeStatusOrder.fulfilled]: (state, action) => {
      const { data } = action.payload;
      statusesAdapter.setAll(state, data);
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [changeStatusOrder.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [addStatus.fulfilled]: (state, action) => {
      statusesAdapter.addOne(state, action.payload.data);
    },
    [updateStatus.fulfilled]: (state, action) => {
      statusesAdapter.upsertOne(state, action.payload.data);
    },
    [removeStatus.fulfilled]: (state, action) => {
      statusesAdapter.removeOne(state, action.payload.id);
    },
  },
});

export const { setStatusesSearchText } = statusSlice.actions;
export const selectStatusesSearchText = ({ ProjectsApp }) => ProjectsApp.statuses.searchText;
export const selectStatusesLoading = ({ ProjectsApp }) => ProjectsApp.statuses.loading;

export default statusSlice.reducer;
