import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { addRoleURL, deleteRoleURL, editRoleURL, getRolesURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import RoleModel from '../roles/model/RoleModel';

export const getRole = createAsyncThunk('role/getRole', async (id, { dispatch, getState }) => {
  try {
    const response = await $api.get(getRolesURL);

    const data = await response.data;
    let role = {};
    data.roles.forEach((i) => {
      if (i.id === +id) {
        role = i;
      }
    });
    return role;
  } catch (error) {
    // history.push({pathname: `/roles`});
    return null;
  }
});

export const removeRole = createAsyncThunk('role/removeRole', async (id, thunkApi) => {
  try {
    const response = await $api.delete(`${deleteRoleURL}/${id}`);
    const data = await response.data.message;

    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const addRole = createAsyncThunk('role/addRole', async (role, thunkApi) => {
  try {
    const fd = new FormData();
    fd.append('id', role?.id);
    fd.append('avatar', role?.avatar);
    fd.append('name', JSON.stringify(role?.name));
    const response = await $api.post(addRoleURL, fd);
    const data = await response.data.message;
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateRole = createAsyncThunk('role/updateRole', async (role, thunkApi) => {
  try {
    const fd = new FormData();
    fd.append('id', role?.id);

    if (role?.avatar) {
      fd.append('avatar', role?.avatar);
    }
    fd.append('name', JSON.stringify(role?.name));
    const response = await $api.post(editRoleURL, fd);

    const data = await response.data.message;

    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

const roleSlice = createSlice({
  name: 'role',
  initialState: null,
  reducers: {
    newRole: (state, action) => RoleModel(),
    resetRole: () => null,
  },
  extraReducers: {
    [getRole.pending]: (state, action) => null,
    [getRole.fulfilled]: (state, action) => action.payload,
    [addRole.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addRole.rejected]: (state, action) => notifyError(action.payload),
    [updateRole.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateRole.rejected]: (state, action) => notifyError(action.payload),
    [removeRole.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeRole.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { resetRole, newRole } = roleSlice.actions;

export const selectRole = ({ administration }) => administration.role;

export default roleSlice.reducer;
