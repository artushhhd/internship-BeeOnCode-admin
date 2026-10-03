import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  getServiceById,
  addServicesURL,
  editServiceURL,
  serviceDeleteURL,
  serviceIsPublished,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';

const createServiceFormData = (service, id) => {
  const fd = new FormData();

  if (id) {
    fd.append('id', id);
  }

  fd.append('title', JSON.stringify(service?.title));
  fd.append('icon_id', service?.icon_id || 0);
  fd.append('long_description', JSON.stringify(createEditorDataForDB(service?.long_description)));

  return fd;
};

export const getService = createAsyncThunk(
  'ServicesApp/service/getService',
  async (id, thunkApi) => {
    try {
      const response = await $api.get(`${getServiceById}/${id}`);
      return response.data.service;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const addService = createAsyncThunk(
  'ServicesApp/service/addService',
  async (service, thunkApi) => {
    try {
      const response = await $api.post(addServicesURL, createServiceFormData(service));
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const editService = createAsyncThunk(
  'ServicesApp/service/editService',
  async (service, thunkApi) => {
    try {
      const response = await $api.post(editServiceURL, createServiceFormData(service, service?.id));
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const statusService = createAsyncThunk(
  'ServicesApp/service/status',
  async ({ id, isPublished }, thunkAPI) => {
    try {
      const response = await $api.post(serviceIsPublished, {
        id,
        is_published: isPublished === 1 ? 0 : 1,
      });
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeService = createAsyncThunk(
  'ServicesApp/service/removeService',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${serviceDeleteURL}/${id}`);
      return response.data.message || 'The service Successfully deleted';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const selectService = ({ ServicesApp }) => ServicesApp.service;

const serviceSlice = createSlice({
  name: 'ServicesApp/service',
  initialState: null,
  reducers: {
    newService: () => ({
      translations: [],
    }),
    resetService: () => null,
  },
  extraReducers: {
    [getService.pending]: (state, action) => null,
    [getService.fulfilled]: (state, action) => action.payload,
    [getService.rejected]: (state, action) => notifyError(action.payload),
    [addService.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addService.rejected]: (state, action) => notifyError(action.payload),
    [editService.fulfilled]: (state, action) => notifySuccess(action.payload),
    [editService.rejected]: (state, action) => notifyError(action.payload),
    [statusService.fulfilled]: (state, action) => notifySuccess(action.payload),
    [statusService.rejected]: (state, action) => notifyError(action.payload),
    [removeService.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeService.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { resetService, newService } = serviceSlice.actions;

export default serviceSlice.reducer;
