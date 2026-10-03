import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  excelEdit,
  excelUpload,
  getProjectsURL,
  orderProjectURL,
  projectFilterURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import FixDate from 'app/shared-components/fixDate';

const projectsAdapter = createEntityAdapter({});

let previousGetFilesController = null;

export const getProjects = createAsyncThunk(
  'ProjectsApp/getProjects',
  async ({ page, isPubleshed, sorting, sort, statusId }, { getState }) => {
    const response = await $api.get(`${getProjectsURL}?page=${page}`, {
      params: {
        is_published: +isPubleshed === 0 ? 0 : 1,
        sorting_order: sorting || 'desc',
        sort_by: sort || null,
        status_id: statusId || null,
      },
    });
    return response.data?.projects;
  }
);

export const getFilterProject = createAsyncThunk('filter/get', async (data, thunkAPI) => {
  try {
    const response = await $api.get(projectFilterURL, {
      params: {
        start_date: data.start_date ? FixDate(data.start_date) : null,
        sorting_order: data?.sorting_order ? data.sorting_order : null,
        sort_by: data?.sort_by ? data.sort_by : null,
        status_id: data?.status_id ? data.status_id : null,

        end_date: data.end_date ? FixDate(data.end_date) : null,
        type: data.areaAll ? data.areaAll : null,
        region_id: data.region_group_id ? data.region_group_id : null,
        q: data.keyword ? data.keyword : null,
      },
    });
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const projectSearch = createAsyncThunk('search/project', async (keyword, thunkAPI) => {
  const controller = new AbortController();
  if (previousGetFilesController) {
    previousGetFilesController.abort();
  }
  previousGetFilesController = controller;

  const urlParams = new URLSearchParams(window.location.search);

  try {
    const response = await $api.get(projectFilterURL, {
      params: { q: keyword || null },
      signal: controller.signal,
    });
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeOrderProjects = createAsyncThunk(
  'ProjectsApp/changeOrderProjects',
  async (array = [], thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderProjectURL, fd);
      return {
        message: response.data.message,
      };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const uploadExcel = createAsyncThunk('project/excel', async (files, thunkApi) => {
  try {
    const fd = new FormData();
    if (files.type !== 'link') {
      files.forEach((file) => fd.append('excel_file', file));
    } else {
      files.link.forEach((link) => fd.append('excel_file', link));
    }
    const response = await $api.post(excelUpload, fd);

    return response.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});
export const editExcelProject = createAsyncThunk('project/excel/edit', async (_, thunkApi) => {
  try {
    const response = await $api.post(excelEdit);

    return response.data.message;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

// export const downloadExcel = createAsyncThunk('project/excel/download', async (_, thunkApi) => {
//   try {
//     const response = await $api.get(downloadExcelURL);
//
//     return response.data;
//   } catch (err) {
//     return thunkApi.rejectWithValue(err.message);
//   }
// });

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    searchText: '',
    loading: false,
    excel: [],
    excelDownload: [],
  },
  reducers: {
    setProjectsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [changeOrderProjects.fulfilled]: (state, action) => {
      notifySuccess(action.payload.message);
    },
    [changeOrderProjects.rejected]: (state, action) => notifyError(action.payload),
    [getProjects.pending]: (state, action) => {
      state.loading = true;
    },

    [getProjects.fulfilled]: (state, action) => {
      state.projects = action.payload;
      state.searchText = '';
      state.loading = false;
    },
    [getFilterProject.fulfilled]: (state, action) => {
      state.projects = action.payload.projects;
      notifySuccess(action.payload.message);
      state.searchText = '';
      state.loading = false;
    },
    [getProjects.rejected]: (state, action) => {
      state.loading = false;
    },
    [getFilterProject.rejected]: (state, action) => {
      state.loading = false;
      notifyError(action.payload);
    },
    [projectSearch.fulfilled]: (state, action) => {
      state.projects = action.payload.projects;
      notifySuccess(action.payload.message);
      state.searchText = '';
      state.loading = false;
    },
    [projectSearch.rejected]: (state, action) => {
      state.loading = false;
      // notifyError(action.payload);
    },
    [uploadExcel.fulfilled]: (state, action) => {
      state.excel = action.payload;
      notifySuccess(action.payload.message);
      state.error = '';
      state.loading = false;
    },
    [uploadExcel.rejected]: (state, action) => {
      state.excel = [];
      notifyError(action.payload.message);
    },
    // [downloadExcel.rejected]: (state, action) => {
    //   state.excelDownload = [];
    //   notifyError(action.payload.message);
    // },
    // [downloadExcel.fulfilled]: (state, action) => {
    //   state.excelDownload = action.payload;
    //   notifyError(action.payload.message);
    // },
    [editExcelProject.fulfilled]: (state, action) => {
      notifySuccess(action.payload);
    },
    [editExcelProject.rejected]: (state, action) => {
      notifyError(action.payload);
    },
  },
});

export const { setProjectsSearchText } = projectsSlice.actions;
export const selectProjectsSearchText = ({ ProjectsApp }) => ProjectsApp.projects.searchText;

export default projectsSlice.reducer;
