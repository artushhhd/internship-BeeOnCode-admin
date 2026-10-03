import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';

import { getTranslationsURL, updateTranslationURL } from '@api/url';

export const getTranslations = createAsyncThunk('translations/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getTranslationsURL);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const changeTranslation = createAsyncThunk(
  'translations/update',
  async ({ id, value, stringId }, thunkAPI) => {
    try {
      const fd = new FormData();

      fd.append('id', id);
      fd.append('value', value);

      const response = await $api.post(updateTranslationURL, fd);
      return { data: response?.data, id, value, stringId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const selectTranslations = (store) => store.TranslationsApp.translationReducer.translations;
export const selectTranslationsLoading = (store) =>
  store.TranslationsApp.translationReducer.loading;

const translationsSlice = createSlice({
  name: 'translations',
  initialState: {
    translations: [],
    loading: false,
    actionLoading: false,
  },

  extraReducers: {
    [getTranslations.pending]: (state) => {
      state.loading = true;
    },
    [getTranslations.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.translations = action.payload;
    },
    [getTranslations.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [changeTranslation.pending]: (state) => {
      state.actionLoading = true;
    },
    [changeTranslation.fulfilled]: (state, action) => {
      state.actionLoading = false;
      state.translations
        .find((t) => t.id === action.payload.stringId)
        .translations.find((t) => t.id === action.payload.id).value = action.payload.value;
    },
    [changeTranslation.rejected]: (state, action) => {
      state.actionLoading = false;
    },
  },
});

export default translationsSlice.reducer;
