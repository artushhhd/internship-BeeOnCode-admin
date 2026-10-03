import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { $api } from '@api/http';
import { addLanguagesURL, deleteLanguageURL, editLanguagesURL, getLanguagesURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import LanguageModel from '../model/LanguageModel';

export const getLanguage = createAsyncThunk(
  'languagesApp/task/getLanguage',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(getLanguagesURL);
      let language;
      response.data.languages.forEach((lang) => {
        if (lang.id === +id) {
          language = lang;
        }
      });

      return language;
    } catch (error) {
      history.push({ pathname: `view/languages` });
      return null;
    }
  }
);

export const addLanguage = createAsyncThunk(
  'languagesApp/languages/addLanguage',
  async (language, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('name', language?.name);
      fd.append('slug', language?.slug);
      fd.append('display_name', language?.display_name);
      fd.append('file_id', language?.file.id);
      fd.append('colors', '#ffffff');
      const response = await $api.post(addLanguagesURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateLanguage = createAsyncThunk(
  'languagesApp/languages/updateLanguage',
  async (language, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('id', language?.id);
      fd.append('name', language?.name);
      fd.append('slug', language?.slug);
      fd.append('display_name', language?.display_name);
      fd.append('file_id', language?.file.id);
      fd.append('colors', '#ffffff');
      const response = await $api.post(editLanguagesURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeLanguage = createAsyncThunk(
  'languagesApp/languages/removeLanguage',
  async (id, thunkAPI) => {
    try {
      const response = await $api.delete(`${deleteLanguageURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const selectLanguage = ({ languagesApp }) => {
  return languagesApp.language;
};

const languageSlice = createSlice({
  name: 'languagesApp/language',
  initialState: null,
  reducers: {
    newLanguage: () => LanguageModel(),
    resetLanguage: () => null,
  },
  extraReducers: {
    [getLanguage.pending]: (state, action) => null,
    [getLanguage.fulfilled]: (state, action) => action.payload,
    [addLanguage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addLanguage.rejected]: (state, action) => notifyError(action.payload),
    [updateLanguage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateLanguage.rejected]: (state, action) => notifyError(action.payload),
    [removeLanguage.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeLanguage.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { resetLanguage, newLanguage } = languageSlice.actions;

export default languageSlice.reducer;
