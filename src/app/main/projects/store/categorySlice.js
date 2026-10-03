import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { addCategoryURL, deleteCategoryURL, editCategoryURL, getCategoryByIdURL } from '@api/url';
import CategoryModel from '../categories/model/CategoryModel';

export const getCategoryById = createAsyncThunk('categories/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getCategoryByIdURL}/${id}`);
    return response?.data?.pageGalleryCategory;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addCategory = createAsyncThunk('categories/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
    const response = await $api.post(addCategoryURL, fd);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateCategory = createAsyncThunk('categories/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('title', JSON.stringify(data.title));

    const response = await $api.post(editCategoryURL, fd);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteCategoryURL}/${id}`);
    return {
      id,
      message: response?.data?.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectCategory = ({ ProjectsApp }) => ProjectsApp.category.item;

export const selectLoading = ({ ProjectsApp }) => ProjectsApp.category.loading;

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    loading: false,
    error: '',
    item: null,
  },
  reducers: {
    newCategory: (state) => ({
      ...state,
      item: CategoryModel(),
    }),
    resetCategory: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },
  extraReducers: {
    [getCategoryById.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategoryById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getCategoryById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [addCategory.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [addCategory.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [updateCategory.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [updateCategory.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [removeCategory.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [removeCategory.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export const { newCategory, resetCategory } = categorySlice.actions;

export default categorySlice.reducer;
