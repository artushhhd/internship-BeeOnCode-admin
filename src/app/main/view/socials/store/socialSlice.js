import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { $api } from '@api/http';

import { notifyError, notifySuccess } from '@helpers/toast';
import { editSocialStatusURL, editSocialsURL, getSocialsURL } from '@api/url';
import SocialModel from '../model/SocialModel';

export const getSocial = createAsyncThunk(
  'socialsApp/task/getSocial',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(getSocialsURL);
      let social;
      response.data.socials.forEach((lang) => {
        if (lang.id === +id) {
          social = lang;
        }
      });

      return social;
    } catch (error) {
      history.push({ pathname: `view/socials` });
      return null;
    }
  }
);

export const updateSocial = createAsyncThunk(
  'socialsApp/socials/updateSocial',
  async (social, thunkAPI) => {
    try {
      const fd = new FormData();
      fd.append('id', social?.id);
      fd.append('url', social?.url);
      const response = await $api.post(editSocialsURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editSocialStatus = createAsyncThunk(
  'socials/changeStatus',
  async (item, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', item.id);
    fd.append('status', item.status ? 0 : 1);

    const response = await $api.post(editSocialStatusURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const selectSocial = ({ socialsApp }) => {
  return socialsApp.social;
};

const socialSlice = createSlice({
  name: 'socialsApp/social',
  initialState: null,
  reducers: {
    newSocial: () => SocialModel(),
    resetSocial: () => null,
  },
  extraReducers: {
    [getSocial.pending]: (state, action) => null,
    [getSocial.fulfilled]: (state, action) => action.payload,
    [updateSocial.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateSocial.rejected]: (state, action) => notifyError(action.payload),
    [editSocialStatus.fulfilled]: (state, action) => notifySuccess(action.payload),
  },
});

export const { resetSocial, newSocial } = socialSlice.actions;

export default socialSlice.reducer;
