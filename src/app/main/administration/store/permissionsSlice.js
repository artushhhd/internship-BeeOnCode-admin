import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  allPermissionsURL,
  changePermissionStatusURL,
  synchronizationURL,
  getPermissionsByIdURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';

export const synchronization = createAsyncThunk(
  'administrator/synchronization',
  async (navigation, { navigationConfig }) => {
    const fd = new FormData();
    const data = navigation
      .map((nav) => {
        if (nav.type === 'group') return nav.children;
        return nav;
      })
      .flat(1);
    fd.append('sections', JSON.stringify(data));
    const response = await $api.post(synchronizationURL, fd);
    return response.data.message;
  }
);

export const getAllPermissions = createAsyncThunk('administrator/allPermissions', async () => {
  const response = await $api.get(allPermissionsURL);
  const data = await response.data;
  return { data: data.permissions };
});
let previousGetFilesController = null;

export const getPermissionsByPage = createAsyncThunk(
  'administrator/permissions/id',
  async ({ userId, pageName }) => {
    try {
      const controller = new AbortController();

      // Abort previous request if exists
      if (previousGetFilesController) {
        previousGetFilesController.abort();
      }
      previousGetFilesController = controller;

      const response = await $api.get(`${getPermissionsByIdURL}/${userId}`, {
        signal: controller.signal,
      });
      const { permission } = await response.data;
      const canView = permission.find((sec) => sec.section?.name === pageName)?.can_view;
      const canManage = permission.find((sec) => sec.section?.name === pageName)?.can_manage;
      return { data: { canView, canManage } };
    } catch (e) {
      return console.log(e);
    }
  }
);

export const changePermission = createAsyncThunk(
  'administrator/changePermission',
  ([id, viewStatus, manageStatus, roleId]) => {
    try {
      const fd = new FormData();
      fd.append('id', id);
      if (viewStatus !== null) {
        fd.append('can_view', viewStatus ? '1' : '0');
      }
      if (manageStatus !== null) {
        fd.append('can_manage', manageStatus ? '1' : '0');
      }
      fd.append('role_id', roleId);

      const response = $api.post(changePermissionStatusURL, fd);

      return response.data;
    } catch (err) {
      return console.log(err);
    }
  }
);

const PermissionsAdapter = createEntityAdapter({});

export const { selectAll: selectPermissions, selectById: selectPermissionsById } =
  PermissionsAdapter.getSelectors(({ administration }) => administration.Permissions);

export const selectPermission = ({ administration }) => administration.Permissions.permissionPage;
export const selectPermissionLoading = ({ administration }) => administration.Permissions.loading;

const permissionsSlice = createSlice({
  name: 'Permissions',
  initialState: PermissionsAdapter.getInitialState({
    permissionPage: { canView: 1, canManage: 1, loading: false },
    user: 0,
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
    [getAllPermissions.fulfilled]: (state, action) => {
      PermissionsAdapter.setAll(state, action.payload.data);
    },
    [getPermissionsByPage.pending]: (state, action) => {
      state.loading = true;
    },
    // [getPermissionsByPage.fulfilled]: (state, action) => {
    //   state.permissionPage = action.payload.data;
    //   state.loading = false;
    // },
    [getPermissionsByPage.rejected]: (state, action) => {
      state.permissionPage = action.payload.data;
      state.loading = false;
    },
    [synchronization.fulfilled]: (state, action) => notifySuccess(action.payload),
    [synchronization.rejected]: (state, action) => notifyError(action.payload),
    [changePermission.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changePermission.rejected]: (state, action) => notifyError(action.payload),
  },
});

export default permissionsSlice.reducer;
