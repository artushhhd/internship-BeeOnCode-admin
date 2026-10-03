import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getAreasURL, orderAreaURL } from '@api/url';
import { addArea, removeArea, updateArea } from './areaSlice';

const areasAdapter = createEntityAdapter({});

export const getAreas = createAsyncThunk('areas/get', async (type, thunkAPI) => {
  try {
    const response = await $api.get(`${getAreasURL}/${type}`);
    return response?.data.areas;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeAreaOrder = createAsyncThunk(
  'areas/changeOrder',
  async (array = [], thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderAreaURL, fd);
      const data = array.map((val) => selectAreaById(thunkAPI.getState(), val));
      return {
        data,
        message: response.data.message,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const areaSlice = createSlice({
  name: 'areas',
  initialState: areasAdapter.getInitialState({
    searchText: '',
    loading: false,
    error: '',
  }),
  reducers: {
    setAreasSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAreas.pending]: (state) => {
      state.loading = true;
    },
    [getAreas.fulfilled]: (state, action) => {
      const data = action.payload;
      areasAdapter.setAll(state, data);
      state.searchText = '';
      state.error = '';
      state.loading = false;
    },
    [getAreas.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeAreaOrder.fulfilled]: (state, action) => {
      const { data } = action.payload;
      areasAdapter.setAll(state, data);
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [changeAreaOrder.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [addArea.fulfilled]: (state, action) => {
      areasAdapter.addOne(state, action.payload.data);
    },
    [updateArea.fulfilled]: (state, action) => {
      areasAdapter.upsertOne(state, action.payload.data);
    },
    [removeArea.fulfilled]: (state, action) => {
      areasAdapter.removeOne(state, action.payload.id);
    },
  },
});
export const { selectAll: selectAreas, selectById: selectAreaById } = areasAdapter.getSelectors(
  (state) => {
    return state.ProjectsApp?.areas;
  }
);
export const { setAreasSearchText } = areaSlice.actions;
export const selectAreasSearchText = ({ ProjectsApp }) => ProjectsApp.areas.searchText;
export const selectAreasLoading = ({ ProjectsApp }) => ProjectsApp.areas.loading;

export default areaSlice.reducer;
