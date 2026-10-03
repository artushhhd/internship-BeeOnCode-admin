import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { deleteAdminUrl, fetchAdminsUrl } from '@api/url';

export const getAdmins = createAsyncThunk('admins/getAdmins', async (params, { getState }) => {
  const response = await $api.get(fetchAdminsUrl);

  const data = await response.data;

  return { data: data.admins };
});

// checkbox-ov jnjel@ backum chka dra hamar chi ashxatum
export const removeAdmins = createAsyncThunk(
  'admins/removeAdmins',
  async (productIds, { dispatch, getState }) => {
    const response = await $api.post(deleteAdminUrl, { data: productIds });

    const data = await response.data.message;

    return data;
  }
);

const adminsAdapter = createEntityAdapter({});

export const { selectAll: selectAdmins, selectById: selectAdminById } = adminsAdapter.getSelectors(
  ({ administration }) => administration.admins
);

const adminsSlice = createSlice({
  name: 'admins',
  initialState: adminsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setAdminsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAdmins.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      adminsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setAdminsSearchText } = adminsSlice.actions;

export const selectAdminsSearchText = ({ administration }) => {
  return administration.admins.searchText;
};

export default adminsSlice.reducer;
