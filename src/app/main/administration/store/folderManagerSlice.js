import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { addFolderURL, editFolderURL, getFileURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';

export const addFolder = createAsyncThunk(
  'folderManagerApp/addFolder',
  async ({ name, folder_color: folderColor, folderId }, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('file_name', name);
      fd.append('folder_color', folderColor);
      if (folderId) {
        fd.append('folder_id', folderId);
      }
      const response = await $api.post(addFolderURL, fd);
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const editFolder = createAsyncThunk(
  'folderManagerApp/editFolder',
  async ({ id, name, folderId, folderColor }, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('file_name', name);
      fd.append('folder_color', folderColor);
      const response = await $api.post(editFolderURL, fd);
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const getFolder = createAsyncThunk('folderManagerApp/get/folder', async (id, thunkApi) => {
  try {
    const response = await $api.get(`${getFileURL}/${id}`);
    return await response.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

const initialState = {
  isMoveEnable: false,
  breadcrumbs: null,
  movedFolderIds: [],
  folders: {},
  loading: false,
  folderItem: null,
};

const FileManagerSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    selectItemForMove: (state, action) => {
      const id = action.payload;
      const array = state.movedFolderIds;

      state.movedFolderIds = array.includes(id)
        ? [...array].filter((v) => v !== id)
        : [...array, id];
    },
    changeMoveStatus: (state, action) => {
      state.isMoveEnable = !!action.payload;
      if (action.payload === false) {
        state.movedFolderIds = [];
      }
    },
    resetSelectedItems: (state) => {
      state.movedFolderIds = [];
    },
  },
  extraReducers: {
    [addFolder.pending]: (state) => {
      state.loading = true;
    },
    [addFolder.fulfilled]: (state, action) => {
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [addFolder.rejected]: (state, action) => {
      state.loading = false;
      notifyError(action.payload.message);
    },

    [editFolder.pending]: (state) => {
      state.loading = true;
    },
    [editFolder.fulfilled]: (state, action) => {
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [editFolder.rejected]: (state, action) => {
      state.loading = false;
      notifyError(action.payload.message);
    },

    [getFolder.pending]: (state) => {
      state.loading = true;
    },
    [getFolder.fulfilled]: (state, action) => {
      state.loading = false;
      state.folderItem = action.payload.media;
    },
    [getFolder.rejected]: (state, action) => {
      state.loading = false;
      notifyError(action.payload.message);
    },
  },
});

export const selectIsEnable = ({ administration }) => administration.FolderManager.isMoveEnable;
export const selectFolderActionLoading = ({ administration }) =>
  administration.FolderManager.loading;
export const selectSelectedFolders = ({ administration }) =>
  administration.FolderManager.movedFolderIds;
export const selectEditedFolders = ({ administration }) => administration.FolderManager.folderItem;
export const { changeMoveStatus, selectItemForMove, resetSelectedItems } = FileManagerSlice.actions;

export default FileManagerSlice.reducer;
