import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api, API_URL } from '@api/http';
import {
  cropImageURL,
  deleteFileURL,
  editFileTitleAlt,
  extractFilesURL,
  getAddFilesURL,
  getAllFilesCountURL,
  getAllFilesURL,
  getFileURL,
  moveFilesURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';

let previousGetFilesController = null;
export const getFiles = createAsyncThunk('fileManagerApp/getFiles', async (_) => {
  const controller = new AbortController();

  // Abort previous request if exists
  if (previousGetFilesController) {
    previousGetFilesController.abort();
  }
  previousGetFilesController = controller;

  const urlParams = new URLSearchParams(window.location.search);

  const params = {};
  params.page = urlParams.get('file_manager_page') || null;
  params.q = urlParams.get('file_manager_search') || null;
  params.folder_id = urlParams.get('file_manager_folder_id') || null;
  params.type = urlParams.get('file_manager_type') || null;
  params.page_size = urlParams.get('file_manager_page_size') || null;

  const response = await $api.get(getAllFilesURL, {
    params,
    signal: controller.signal,
  });
  return response.data;
});

export const getFile = createAsyncThunk('getMediaCount/get/file', async (id, thunkApi) => {
  try {
    const response = await $api.get(`${getFileURL}/${id}`);
    return await response.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

let previousGetMediaCountController = null;
let fileUploadAbortController = new AbortController();

export const getMediaCount = createAsyncThunk(
  'getMediaCount/getMediaCount',
  async (_, thunkApi) => {
    const controller = new AbortController();
    const { signal } = controller;

    // Abort previous request if exists
    if (previousGetMediaCountController) {
      previousGetMediaCountController.abort();
    }
    previousGetMediaCountController = controller;

    const urlParams = new URLSearchParams(window.location.search);

    const params = {};
    params.q = urlParams.get('file_manager_search') || null;
    params.folder_id = urlParams.get('file_manager_folder_id') || null;

    try {
      const response = await $api.get(getAllFilesCountURL, { params, signal });
      const data = await response.data;
      return { data };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const addFiles = createAsyncThunk('fileManagerApp/addFiles', async (files, thunkApi) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const folderId = urlParams.get('file_manager_folder_id');
    const fd = new FormData();

    const { signal } = fileUploadAbortController;

    if (folderId) {
      fd.append('folder_id', folderId);
    }
    if (files.type !== 'link') {
      files.forEach((file) => fd.append('media[]', file));
    } else {
      files.link.forEach((link) => fd.append('links[]', link));
    }
    const response = await $api.post(getAddFilesURL, fd, {
      signal,
      onUploadProgress: (progressEvent) => {
        thunkApi.dispatch(
          updateUploadPercent(Math.floor((progressEvent.loaded / progressEvent.total) * 100))
        );
      },
    });
    return response.data;
  } catch (err) {
    return thunkApi.rejectWithValue('Upload canceled');
  }
});

export const cropImage = createAsyncThunk('fileManagerApp/CropImage', async ({ file, fileId }) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('file_id', fileId);
  const response = await $api.post(cropImageURL, fd);
  const data = await response.data;
  return { data: data.message };
});

export const editFile = createAsyncThunk('fileManager/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('titles', JSON.stringify(data.titles));
    if (data.alt) {
      fd.append('alt', JSON.stringify(data.alt));
    }
    const response = await $api.post(editFileTitleAlt, fd);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const deleteFile = createAsyncThunk('fileManager/deleteFile', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteFileURL}/${id}`);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const moveFiles = createAsyncThunk(
  'fileManager/moveFiles',
  async ({ ids, folderId }, thunkApi) => {
    try {
      const fd = new FormData();
      ids.forEach((id) => {
        fd.append('ids[]', id);
      });
      if (folderId) {
        fd.append('folder_id', folderId);
      }
      const response = await $api.post(moveFilesURL, fd);
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);
export const downloadFile = createAsyncThunk('fileManager/downloadFile ', async (id, thunkApi) => {
  try {
    const link = document.createElement('a');
    link.href = `${API_URL}/download/${id}`;
    link.setAttribute('download', 'true');
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    return true;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const extractFiles = createAsyncThunk(
  'fileManager/extractZip',
  async ({ path }, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('zip_path', path);

      const response = await $api.post(extractFilesURL, fd);
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  searchText: '',
  value: {},
  count: [],
  fileItem: { media: {} },
  loadingAll: false,
  loadingItem: false,
  loadingCount: false,
  loadingAction: false,
  loadingInsideZip: false,
  breadcrumbs: null,
  percent: 0,
  insideZip: [],
};
export const selectFiles = ({ administration }) => administration.FileManager.value;
export const selectBreadcrumbs = ({ administration }) => administration.FileManager.breadcrumbs;
export const selectCount = ({ administration }) => administration.FileManager.count;
export const getFileToEdit = ({ administration }) => administration.FileManager.fileItem;
export const selectFilesLoadingAll = ({ administration }) => administration.FileManager.loadingAll;
export const selectFileLoadingItem = ({ administration }) => administration.FileManager.loadingItem;
export const selectFilesLoadingCount = ({ administration }) =>
  administration.FileManager.loadingCount;
export const selectFileUploadPercent = ({ administration }) => administration.FileManager.percent;
export const selectFilesInsideZip = ({ administration }) => administration.FileManager.insideZip;
export const selectLoadingInsideZip = ({ administration }) =>
  administration.FileManager.loadingInsideZip;

const FileManagerSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    updateUploadPercent: (state, action) => {
      state.percent = action.payload;
    },
    cancelUpload: () => {
      fileUploadAbortController.abort();
      fileUploadAbortController = new AbortController();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFiles.pending, (state) => {
        state.loadingAll = true;
      })
      .addCase(getFiles.fulfilled, (state, action) => {
        state.value = action.payload.media;
        state.breadcrumbs = action.payload.folder;
        state.loadingAll = false;
      })
      .addCase(getFiles.rejected, (state) => {
        state.loadingAll = false;
      })
      .addCase(getFile.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getFile.fulfilled, (state, action) => {
        state.fileItem = action.payload.media;
        state.loadingItem = false;
      })
      .addCase(getFile.rejected, (state) => {
        state.loadingItem = false;
      })
      .addCase(getMediaCount.pending, (state) => {
        state.loadingCount = true;
      })
      .addCase(getMediaCount.fulfilled, (state, action) => {
        state.count = action.payload.data;
        state.loadingCount = false;
      })
      .addCase(getMediaCount.rejected, (state) => {
        state.loadingCount = false;
      })
      .addCase(addFiles.rejected, (state, action) => {
        notifyError(action.payload);
        state.percent = 0;
      })
      .addCase(addFiles.fulfilled, (state) => {
        state.percent = 0;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        notifySuccess(action.payload?.message);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        notifyError(action.payload?.message);
      })
      .addCase(moveFiles.pending, (state) => {
        state.loadingAction = true;
      })
      .addCase(moveFiles.fulfilled, (state, action) => {
        state.loadingAction = false;
        notifySuccess(action.payload.message);
      })
      .addCase(moveFiles.rejected, (state, action) => {
        state.loadingAction = false;
        notifyError(action.payload.message);
      })
      .addCase(extractFiles.pending, (state) => {
        state.loadingInsideZip = true;
      })
      .addCase(extractFiles.fulfilled, (state, action) => {
        const data = Array.from(Object.values(action.payload.file_contents)).map((path) => {
          const extension = path.split('.').slice(-1)[0];
          const type = path.split('.').length === 1 ? 'folder' : 'file';
          return {
            path,
            extension,
            name: path.split('/').slice(-1)[0],
            type,
          };
        });

        state.insideZip = [
          ...data.filter((item) => item.type === 'folder'),
          ...data.filter((item) => item.type !== 'folder'),
        ];

        state.loadingInsideZip = false;
      })
      .addCase(extractFiles.rejected, (state) => {
        state.loadingInsideZip = false;
      });
  },
});
export const { updateUploadPercent, cancelUpload } = FileManagerSlice.actions;
export default FileManagerSlice.reducer;
