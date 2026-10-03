import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';
import { notifyError } from '@helpers/toast';
import { getServicesAll, servicesOrderURL } from '@api/url';

export const getServices = createAsyncThunk(
  'ServicesApp/services/getServices',
  async (_, thunkApi) => {
    try {
      const response = await $api.get(getServicesAll);
      return { data: response.data?.services || [] };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const changeServicesOrder = createAsyncThunk(
  'ServicesApp/services/changeOrder',
  async (array, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(servicesOrderURL, fd);
      return response.data.message || 'The order of service was successfully changed';
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const servicesAdapter = createEntityAdapter({});

export const selectSearchText = ({ ServicesApp }) => ServicesApp.services.searchText;

export const { selectAll: selectServices, selectById: selectServicesById } =
  servicesAdapter.getSelectors((state) => state.ServicesApp.services);

export const selectFilteredServices = createSelector(
  [selectServices, selectSearchText],
  (services, searchText = []) => {
    if (searchText.length === 0) {
      return services;
    }
    return FuseUtils.filterArrayByString(services, searchText);
  }
);

export const selectGroupedFilteredServices = createSelector(
  [selectFilteredServices],
  (services) => {
    return services;
  }
);

const servicesSlice = createSlice({
  name: 'ServicesApp/services',
  initialState: servicesAdapter.getInitialState({
    searchText: '',
    loading: false,
  }),
  reducers: {
    setServicesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getServices.pending]: (state) => {
      state.loading = true;
    },
    [getServices.fulfilled]: (state, action) => {
      const { data } = action.payload;
      servicesAdapter.setAll(state, data);
      state.searchText = '';
      state.loading = false;
    },
    [getServices.rejected]: (state, action) => {
      state.loading = false;
      notifyError(action.payload);
    },
    [changeServicesOrder.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { setServicesSearchText } = servicesSlice.actions;

export default servicesSlice.reducer;
