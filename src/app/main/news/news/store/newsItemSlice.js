import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  addNewsItemURL,
  deleteNewsItemURL,
  editNewsItemURL,
  getNewsByIdURL,
  isNotifiedNewsURL,
  statusNewsURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import FixDate from 'app/shared-components/fixDate';
import NewsModel from '../model/NewsModel';

export const getNewsItemById = createAsyncThunk('newsItem/ById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getNewsByIdURL}/${id}`);
    return response.data.news;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const addNewsItem = createAsyncThunk('newsItem/add', async (newsItem, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(newsItem?.title));
    // fd.append('is_published', 1);
    // fd.append('is_notified', 1);
    // fd.append('date', new Date(newsItem?.date || null).toISOString());

    fd.append('date', FixDate(newsItem.date ? newsItem.date : Date.now()));

    // fd.append('category', JSON.stringify(newsItem?.category));
    // fd.append('grantee', JSON.stringify(newsItem?.grantee));
    // fd.append('focal_area', JSON.stringify(newsItem?.focal_area));
    // fd.append('cross_cutting_areas', JSON.stringify(newsItem?.cross_cutti ng_areas));
    fd.append('file_id', newsItem.file_id || -1);
    fd.append('files_id', JSON.stringify(newsItem?.files_id));
    fd.append('short_description', JSON.stringify(newsItem?.short_description));
    fd.append(
      'long_description',
      JSON.stringify(createEditorDataForDB(newsItem?.long_description))
    );
    const response = await $api.post(addNewsItemURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const editNewsItem = createAsyncThunk('newsItem/edit', async (newsItem, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', newsItem?.id);
    fd.append('title', JSON.stringify(newsItem?.title));
    fd.append('file_id', newsItem?.file_id || 0);
    const date = new Date(newsItem?.date);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    fd.append('date', FixDate(newsItem.date));
    fd.append('files_id', JSON.stringify(newsItem?.files_id) || JSON.stringify([]));
    fd.append('short_description', JSON.stringify(newsItem?.short_description));
    fd.append('long_description', JSON.stringify(newsItem?.long_description));
    fd.append('keyword', JSON.stringify(newsItem.keyword));
    fd.append('meta', JSON.stringify(newsItem?.meta));
    const response = await $api.post(editNewsItemURL, fd);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const statusNews = createAsyncThunk('news/status', async ({ id, isPublished }, thunkAPI) => {
  try {
    // const fd = new FormData();
    // fd.append('id', id);

    const response = await $api.post(statusNewsURL, {
      id,
      is_published: isPublished === 1 ? 0 : 1,
    });
    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
export const isnotifiedNews = createAsyncThunk(
  'news/notified',
  async ({ id, isNotified }, thunkAPI) => {
    try {
      // const fd = new FormData();
      // fd.append('id', id);

      const response = await $api.post(isNotifiedNewsURL, {
        id,
        is_notified: isNotified === 1 ? 0 : 1,
      });
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteNewsItem = createAsyncThunk('newsItem/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteNewsItemURL}/${id}`);
    return {
      id,
      message: response.data.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const selectNewsItem = ({ newsApp }) => newsApp.newsItem.item;
export const selectLoading = ({ newsApp }) => newsApp.newsItem.loading;

const newsItemSlice = createSlice({
  name: 'newsItem',
  initialState: {
    loading: false,
    error: '',
    item: null,
  },
  reducers: {
    newNewsItem: (state) => ({ ...state, item: NewsModel() }),
    resetNewsItem: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },
  extraReducers: {
    [getNewsItemById.pending]: (state, action) => {
      state.loading = null;
    },
    [getNewsItemById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getNewsItemById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [addNewsItem.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [addNewsItem.rejected]: (state, action) => {
      notifyError(action.payload);
    },
    [isnotifiedNews.fulfilled]: (state, action) => {
      notifySuccess(action.payload);
    },
    [statusNews.fulfilled]: (state, action) => {
      notifySuccess(action.payload);
    },

    [editNewsItem.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [editNewsItem.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      notifyError(action.payload);
    },

    [deleteNewsItem.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [deleteNewsItem.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export const { newNewsItem, resetNewsItem } = newsItemSlice.actions;

export default newsItemSlice.reducer;
