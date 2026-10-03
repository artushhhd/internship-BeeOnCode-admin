import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getCategoryURL, orderCategoryURL } from '@api/url';
import { addCategory, removeCategory, updateCategory } from './categorySlice';

const categoriesAdapter = createEntityAdapter({});

export const { selectAll: selectCategories, selectById: selectCategoryById } =
  categoriesAdapter.getSelectors(({ ProjectsApp }) => ProjectsApp.categories);

export const getCategories = createAsyncThunk('categories/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getCategoryURL);
    return response?.data?.pageGalleryCategory;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeCategoryOrder = createAsyncThunk(
  'categories/changeOrder',
  async (array = [], thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderCategoryURL, fd);
      const data = array.map((val) => selectCategoryById(thunkAPI.getState(), val));
      return {
        data,
        message: response?.data?.message,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: categoriesAdapter.getInitialState({
    searchText: '',
    loading: false,
    error: '',
  }),
  reducers: {
    setCategoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getCategories.pending]: (state) => {
      state.loading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      const data = action.payload;
      categoriesAdapter.setAll(state, data);
      state.searchText = '';
      state.error = '';
      state.loading = false;
    },
    [getCategories.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeCategoryOrder.fulfilled]: (state, action) => {
      const { data } = action.payload;
      categoriesAdapter.setAll(state, data);
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [changeCategoryOrder.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [addCategory.fulfilled]: (state, action) => {
      categoriesAdapter.addOne(state, action.payload.data);
    },
    [updateCategory.fulfilled]: (state, action) => {
      categoriesAdapter.upsertOne(state, action.payload.data);
    },
    [removeCategory.fulfilled]: (state, action) => {
      categoriesAdapter.removeOne(state, action.payload.id);
    },
  },
});
export const { setCategoriesSearchText } = categorySlice.actions;
export const selectCategoriesSearchText = ({ ProjectsApp }) => ProjectsApp.categories.searchText;
export const selectCategoriesLoading = ({ ProjectsApp }) => ProjectsApp.categories.loading;

export default categorySlice.reducer;
