import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getNewsURL, newsFilterURL, orderNewsURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import FixDate from 'app/shared-components/fixDate';

const newsAdapter = createEntityAdapter({});
let previousGetFilesController = null;

export const getNews = createAsyncThunk('news/get', async ({ page, isPubleshed }, thunkAPI) => {
  try {
    const response = await $api.get(`${getNewsURL}?page=${page}`, {
      params: {
        is_published: +isPubleshed === 0 ? 0 : 1,
      },
    });
    return response?.data?.news;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getFilterNews = createAsyncThunk('newsFilter/get', async (data, thunkAPI) => {
  try {
    const response = await $api.get(newsFilterURL, {
      params: {
        start_date: data.start_date ? FixDate(data.start_date) : null,
        end_date: data.end_date ? FixDate(data.end_date) : null,
        q: data.keyword ? data.keyword : null,
      },
    });
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const newsSearchFilter = createAsyncThunk('search/news', async (keyword, thunkAPI) => {
  const controller = new AbortController();
  if (previousGetFilesController) {
    previousGetFilesController.abort();
  }
  previousGetFilesController = controller;

  const urlParams = new URLSearchParams(window.location.search);

  try {
    const response = await $api.get(newsFilterURL, {
      params: { q: keyword || null },
      signal: controller.signal,
    });
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeOrderNews = createAsyncThunk(
  'news/changeOrder',
  async (array = [], thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderNewsURL, fd);
      // const data = array.map((val) => selectNewsById(thunkApi.getState(), val));
      return {
        message: response.data.message,
      };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

// export const { selectAll: selectNews, selectById: selectNewsById } = newsAdapter.getSelectors(
//   ({ newsApp }) => newsApp.news
// );

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    news: [],
    searchText: '',
    loading: false,
    error: '',
  },
  reducers: {
    setNewsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getNews.pending]: (state) => {
      state.loading = true;
    },
    [getNews.fulfilled]: (state, action) => {
      const data = action.payload;
      state.news = action.payload;
      state.searchText = '';
      state.error = '';
      state.loading = false;
    },
    [getFilterNews.fulfilled]: (state, action) => {
      const data = action.payload;
      state.news = action.payload.news;
      state.searchText = '';
      state.error = '';
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [getNews.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    [getFilterNews.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      notifyError(action.payload);
    },
    [newsSearchFilter.fulfilled]: (state, action) => {
      const data = action.payload;
      state.news = action.payload.news;
      state.searchText = '';
      state.error = '';
      state.loading = false;
      notifySuccess(action.payload.message);
    },

    [changeOrderNews.fulfilled]: (state, action) => {
      notifySuccess(action.payload.message);
    },
    [changeOrderNews.rejected]: (state, action) => {
      notifyError(action.payload);
    },
  },
});

export const { setNewsSearchText } = newsSlice.actions;
export const selectNewsSearchText = ({ newsApp }) => newsApp.news.searchText;
export const selectNewsLoading = ({ newsApp }) => newsApp.news.loading;

export default newsSlice.reducer;
