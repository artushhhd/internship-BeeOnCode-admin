import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { editAboutURL, getAboutURL } from '@api/url';
import { notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import aboutModel from '../model/AboutModel';

export const getAbout = createAsyncThunk('getAbout', async (_, { rejectedWithValue }) => {
  try {
    const response = await $api.get(getAboutURL);
    return response.data;
  } catch (e) {
    return rejectedWithValue(e.message);
  }
});

export const editAbout = createAsyncThunk('editAbout', async (data, { rejectedWithValue }) => {
  try {
    const fd = new FormData();
    fd.append('id', data?.id);
    fd.append('title', JSON.stringify(data?.title));
    fd.append('short_description', JSON.stringify(data?.short_description));
    fd.append('description', JSON.stringify(createEditorDataForDB(data?.description)));

    if (data.link?.length) {
      data.link.forEach((url) => {
        if (url) fd.append('video_url[]', url);
      });
    }
    fd.append('deleted_media', JSON.stringify(data.deletedMedia || []));
    data.selected.forEach((img) => {
      if (!img.video_url) {
        fd.append('files_id[]', img.id);
      }
    });

    const response = await $api.post(editAboutURL, fd);
    return response.data;
  } catch (e) {
    return rejectedWithValue(e.message);
  }
});

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    about: aboutModel(),
    loading: false,
  },
  extraReducers: {
    [getAbout.fulfilled]: (state, action) => {
      state.about = action.payload.about;
    },
    [editAbout.fulfilled]: (state, action) => {
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [editAbout.pending]: (state, action) => {
      state.loading = true;
    },
  },
});

export default aboutSlice.reducer;
