import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import {
  getBackupURL,
  backupRestoreURL,
  backupRunUrl,
  backupSaveURL,
  backupSettingsGet,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import FixDate from 'app/shared-components/fixDate';

export const getBackup = createAsyncThunk('backups/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getBackupURL);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const backupRestoreById = createAsyncThunk('beckup/byId', async (data, thunkAPI) => {
  try {
    const response = await $api.post(
      `${backupRestoreURL}?id=${data.id}&name=${data.name}&choice=${data.choice}`
    );
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
export const backupRun = createAsyncThunk('beckup/run', async (_, thunkAPI) => {
  try {
    const response = await $api.post(backupRunUrl);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
export const backupSave = createAsyncThunk('backup/save', async (item, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('ip', item?.ip);
    fd.append('ftp_username', item?.ftp_username);
    fd.append('ftp_password', item?.ftp_password);
    fd.append('ftp_port', item?.ftp_port);

    fd.append('time1', FixDate(item.time1 || Date.now()));
    fd.append('time2', FixDate(item.time2 || Date.now()));

    const response = await $api.post(backupSaveURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getBackupSettings = createAsyncThunk('backups/settingsGet', async (_, thunkAPI) => {
  try {
    const response = await $api.get(backupSettingsGet);
    return response?.data.backups?.[0];
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const backupSlice = createSlice({
  name: 'backup',
  initialState: {
    backup: [],
    backupSettings: [],
    loading: false,
    error: '',
  },
  extraReducers: {
    [getBackup.pending.type]: (state) => {
      state.loading = true;
    },
    [getBackup.fulfilled.type]: (state, action) => {
      state.error = '';
      state.loading = action?.payload?.is_backup_start;
      state.backup = action.payload;
    },

    [getBackup.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    [getBackupSettings.fulfilled.type]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.backupSettings = action.payload;
    },
    [getBackupSettings.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [backupRestoreById.fulfilled.type]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      notifySuccess(action.payload.message);
    },
    [backupRestoreById.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
    [backupRun.fulfilled.type]: (state, action) => {
      notifySuccess(action.payload.message);
      state.loading = false;
    },
    [backupRun.pending.type]: (state, action) => {
      state.loading = true;
    },
    [backupRun.rejected.type]: (state, action) => {
      notifyError(action.payload);
      state.loading = false;
    },
    [backupSave.fulfilled]: (state, action) => {
      notifySuccess(action.payload.message);
    },
    [backupSave.rejected]: (state, action) => {
      notifyError(action.payload);
    },
  },
});

export default backupSlice.reducer;
