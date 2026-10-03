import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import history from '@history*';
import { $api } from '@api/http';
import {
  addProjectURL,
  deleteProjectURL,
  editProjectURL,
  getAreasURL,
  getProjectByIdURL,
  notifiedProjectURL,
  statusProjectURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import ProjectModel from '../projects/model/ProjectModel';

export const getProjectById = createAsyncThunk(
  'ProjectsApp/getProjectById',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(`${getProjectByIdURL}/${id}`);
      return response.data.project;
    } catch (error) {
      // history.push({ pathname: `view/projects` });
      return null;
    }
  }
);

export const addProject = createAsyncThunk('ProjectsApp/addProject', async (project, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(project?.title));
    fd.append('grantee', JSON.stringify(project?.grantee));
    // fd.append('is_number_visible', project.is_number_visible);
    // fd.append('start_date', FixDate(project?.start_date || Date.now()));
    // fd.append('end_date', FixDate(project?.end_date || Date.now()));
    // fd.append('focal_area_id', project?.focal_area_id || -1);
    // fd.append('cross_cutting_area_id', project?.cross_cutting_area_id || -1);
    // fd.append('grant_amount', project?.grant_amount);
    fd.append('file_id', project?.file_id || -1);
    fd.append('files_id', JSON.stringify(project?.files_id) || null);
    // fd.append('status_id', project?.status_id || 1);
    // fd.append('region_group_id', JSON.stringify(project?.region_group_id) || -1);
    // fd.append('number', project?.number || 0);
    // fd.append('sponsor_amount', project?.sponsor_amount || 0);
    // fd.append('partial_amount', project?.partial_amount || 0);
    // fd.append('date', FixDate(project.date || Date.now()));
    fd.append('keyword', JSON.stringify(project?.keyword) || null);
    fd.append('is_published', project?.is_published);
    fd.append('meta', JSON.stringify(project?.meta));

    fd.append('short_description', JSON.stringify(project?.short_description));
    fd.append('long_description', JSON.stringify(createEditorDataForDB(project?.long_description)));

    const response = await $api.post(addProjectURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const editProject = createAsyncThunk(
  'ProjectsApp/editProject',
  async (project, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('id', project?.id);
      // fd.append('is_number_visible', project.is_number_visible);
      fd.append('title', JSON.stringify(project?.title));
      fd.append('grantee', JSON.stringify(project?.grantee));
      // fd.append('focal_area_id', project?.focal_area_id || -1);
      // fd.append('cross_cutting_area_id', project?.cross_cutting_area_id || -1);
      // fd.append('start_date', FixDate(project?.start_date));
      // fd.append('end_date', FixDate(project?.end_date));
      // fd.append('date', FixDate(project.date));
      // fd.append('area_id', project?.area_id || -1);
      // fd.append('grant_amount', project?.grant_amount);
      // fd.append('status_id', project?.status_id);
      fd.append('file_id', project.file_id || -1);
      fd.append('files_id', JSON.stringify(project?.files_id));
      // fd.append('region_group_id', JSON.stringify(project?.region_group_id));
      // fd.append('number', project?.number || 0);
      // fd.append('sponsor_amount', project?.sponsor_amount ? project?.sponsor_amount : 0);
      // fd.append('partial_amount', project?.partial_amount || 0);
      fd.append('keyword', JSON.stringify(project?.keyword));
      fd.append('meta', JSON.stringify(project?.meta));
      // project.selected.forEach((img) => {
      //   fd.append('image_gallery_id[]', img.id);
      // });
      fd.append('short_description', JSON.stringify(project?.short_description));
      fd.append('long_description', JSON.stringify(project?.long_description));
      const response = await $api.post(editProjectURL, fd);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteProject = createAsyncThunk('ProjectsApp/deleteProject', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteProjectURL}/${id}`);
    return {
      id,
      message: response.data.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const statusProject = createAsyncThunk(
  'project/status',
  async ({ id, isPublished }, thunkAPI) => {
    try {
      // const fd = new FormData();
      // fd.append('id', id);

      const response = await $api.post(statusProjectURL, {
        id,
        is_published: isPublished === 1 ? 0 : 1,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const isnotifiedProject = createAsyncThunk(
  'project/status',
  async ({ id, isNotified }, thunkAPI) => {
    try {
      // const fd = new FormData();
      // fd.append('id', id);

      const response = await $api.post(notifiedProjectURL, {
        id,
        is_notified: isNotified === 1 ? 0 : 1,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getCrossArea = createAsyncThunk('crosArea/get', async (type, thunkAPI) => {
  try {
    const response = await $api.get(`${getAreasURL}/cross_cutting_area`);
    return response?.data.areas;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectProject = ({ ProjectsApp }) => ProjectsApp?.project?.item;
export const selectLoading = ({ ProjectsApp }) => ProjectsApp?.project?.loading;
export const selectCrossArea = ({ ProjectsApp }) => ProjectsApp?.project?.crossArea;

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    loading: false,
    error: '',
    item: null,
    crossArea: null,
  },
  reducers: {
    newProject: (state) => ({
      ...state,
      item: ProjectModel(),
    }),
    resetProject: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },
  extraReducers: {
    [getProjectById.pending]: (state, action) => {
      state.loading = true;
    },
    [getProjectById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getCrossArea.fulfilled]: (state, action) => {
      state.error = '';
      state.crossArea = action.payload;
      state.loading = false;
    },
    [getProjectById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    [addProject.fulfilled]: (state, action) => notifySuccess(action.payload.message),
    [isnotifiedProject.fulfilled]: (state, action) => notifySuccess(action.payload.message),
    [statusProject.fulfilled]: (state, action) => notifySuccess(action.payload.message),
    [addProject.rejected]: (state, action) => notifyError(action.payload),
    [editProject.fulfilled]: (state, action) => notifySuccess(action.payload.message),
    [editProject.rejected]: (state, action) => notifyError(action.payload),
    [deleteProject.fulfilled]: (state, action) => notifySuccess(action.payload.message),
    [deleteProject.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { newProject, resetProject } = projectSlice.actions;

export default projectSlice.reducer;
