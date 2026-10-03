import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { notifyError, notifySuccess } from '@helpers/toast';
import {
  addPartnerURL,
  deletePartnerURL,
  editPartnerURL,
  getPartnersURL,
  orderPartnerURL,
  getPartnerURL,
  statusPartnerURL,
  visiblePartnerURL,
} from '@api/url';

export const getPartners = createAsyncThunk('partners/get', async (page, thunkAPI) => {
  try {
    const response = await $api.get(`${getPartnersURL}?page=${page}`);
    return response?.data.partners;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changePartnerOrder = createAsyncThunk(
  'partner/changeOrder',
  async (array, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderPartnerURL, fd);
      return response.data.message || ' The order of point was successfully changed';
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getPartnerById = createAsyncThunk('partner/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getPartnerURL}/${id}`);
    return response.data.partner;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addPartner = createAsyncThunk('partner/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
    fd.append('icon_id', data?.icon_id || 0);
    fd.append('status', data?.checked);
    fd.append('link', data?.link);
    fd.append('is_main', 1);
    fd.append('is_visible', 1);
    const response = await $api.post(addPartnerURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updatePartner = createAsyncThunk('partner/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data?.id);
    fd.append('title', JSON.stringify(data?.title));
    fd.append('icon_id', data?.icon_id || 0);
    fd.append('status', data?.checked);
    fd.append('link', data?.link);
    fd.append('is_main', 1);
    fd.append('is_visible', 1);
    const response = await $api.post(editPartnerURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const statusPartner = createAsyncThunk('partner/status', async (id, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', id);

    const response = await $api.post(statusPartnerURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const visiblePartner = createAsyncThunk('partner/visiable', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('is_visible', data.visiable ? 0 : 1);

    const response = await $api.post(visiblePartnerURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removePartner = createAsyncThunk('partner/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deletePartnerURL}/${id}`);
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const partnersSlice = createSlice({
  name: 'partners',
  initialState: {
    partners: [],
    loading: false,
    error: '',
    item: { translations: [] },
  },
  extraReducers: {
    [getPartners.pending.type]: (state) => {
      state.loading = true;
    },
    [getPartners.fulfilled.type]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.partners = action.payload;
    },
    [getPartners.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    [changePartnerOrder.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [changePartnerOrder.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [getPartnerById.fulfilled.type]: (state, action) => {
      state.error = '';
      state.item = action.payload;
    },
    [getPartnerById.rejected.type]: (state, action) => {
      state.error = action.payload;
    },

    [addPartner.pending.type]: (state) => {
      state.loading = true;
    },
    [addPartner.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [addPartner.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [updatePartner.pending.type]: (state) => {
      state.loading = true;
    },
    [updatePartner.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [updatePartner.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },
    [statusPartner.pending.type]: (state) => {
      state.loading = true;
    },
    [statusPartner.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [statusPartner.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },
    [visiblePartner.pending.type]: (state) => {
      state.loading = true;
    },
    [visiblePartner.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
      state.loading = false;
    },
    [visiblePartner.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
      state.loading = false;
    },

    [removePartner.fulfilled.type]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [removePartner.rejected.type]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export default partnersSlice.reducer;
