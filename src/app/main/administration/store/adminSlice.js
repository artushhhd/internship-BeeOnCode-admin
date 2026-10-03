import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { deleteAdminUrl, editAdminUrl, fetchAdminsUrl, registerAdminUrl } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import AdminModel from '../admins/model/AdminModel';

export const getAdmin = createAsyncThunk('admin/getAdmin', async (id, { dispatch, getState }) => {
  try {
    const response = await $api.get(fetchAdminsUrl);

    const data = await response.data;
    return data.admins.find((i) => i.id === +id);
  } catch (error) {
    // history.push({pathname: `/admins`});

    return null;
  }
});

export const removeAdmin = createAsyncThunk('admin/removeAdmin', async (id, thunkApi) => {
  try {
    const response = await $api.delete(`${deleteAdminUrl}/${id}`);
    return response.data.message;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const addAdmin = createAsyncThunk('admin/addAdmin', async (admin, thunkApi) => {
  try {
    const fd = new FormData();
    fd.append('file_id', admin?.file_id || 0);
    // if (admin?.avatar) fd.append('avatar', admin.avatar);
    fd.append('name', admin.name);
    fd.append('role_id', admin.role_id);
    fd.append('email', admin.email);
    fd.append('password', admin.password);
    const response = await $api.post(registerAdminUrl, fd);
    const data = await response.data.message;
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateAdmin = createAsyncThunk('admin/updateAdmin', async (admin, thunkApi) => {
  try {
    const fd = new FormData();
    fd.append('id', admin.id);
    if (admin?.file_id) {
      fd.append('file_id', admin?.file_id);
    }
    // if (admin.avatar !== null) {
    //   fd.append('avatar', admin.avatar);
    // }
    if (admin.name) {
      fd.append('name', admin.name);
    }
    if (admin.role_id) {
      fd.append('role_id', admin.role_id);
    }
    if (admin.email) {
      fd.append('email', admin.email);
    }
    if (admin.password) {
      fd.append('password', admin.password);
    }
    const response = await $api.post(editAdminUrl, fd);
    const data = await response.data.message;
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const selectRole = ({ administration }) => {
  return administration.admin;
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: null,
  reducers: {
    newAdmin: (state, action) => AdminModel(),
    resetAdmin: () => null,
  },
  extraReducers: {
    [getAdmin.pending]: (state, action) => null,
    [getAdmin.fulfilled]: (state, action) => action.payload,
    [addAdmin.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addAdmin.rejected]: (state, action) => notifyError(action.payload),
    [updateAdmin.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateAdmin.rejected]: (state, action) => notifyError(action.payload),
    [removeAdmin.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeAdmin.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { resetAdmin, newAdmin } = adminSlice.actions;

export const selectAdmin = ({ administration }) => administration.admin;

export default adminSlice.reducer;
