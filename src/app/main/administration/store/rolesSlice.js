import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getRolesURL } from '@api/url';
import { addRole, updateRole } from './roleSlice';

export const getRoles = createAsyncThunk('roles/getRoles', async (params, { getState }) => {
  const response = await $api.get(getRolesURL);

  const data = await response.data;
  return { data: data.roles };
});

const rolesAdapter = createEntityAdapter({});

export const { selectAll: selectRoles } = rolesAdapter.getSelectors(
  ({ administration }) => administration.roles
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState: rolesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setRolesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateRole.fulfilled]: rolesAdapter.upsertOne,

    [getRoles.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      rolesAdapter.setAll(state, data);
      state.searchText = '';
    },
    [addRole.fulfilled]: rolesAdapter.addOne,
  },
});

export const { setRolesSearchText } = rolesSlice.actions;

export const selectRolesSearchText = ({ administration }) => {
  return administration.roles.searchText;
};

export default rolesSlice.reducer;
