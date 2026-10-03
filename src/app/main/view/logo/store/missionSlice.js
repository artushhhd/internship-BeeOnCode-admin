import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getMissionURL, saveMissionURL } from '@api/url';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import { notifySuccess } from '@helpers/toast';

export const getMission = createAsyncThunk('getMissionn', async (_, { rejectedWithValue }) => {
  try {
    const response = await $api.get(getMissionURL);
    return response.data;
  } catch (e) {
    return rejectedWithValue(e.message);
  }
});

export const editMission = createAsyncThunk('editMissionn', async (data, { rejectedWithValue }) => {
  try {
    const fd = new FormData();
    fd.append('id', 1);
    fd.append('order', 1);
    fd.append('file_id', data?.file_id);
    fd.append('title', JSON.stringify(data?.title));
    fd.append('short_description', JSON.stringify(data?.short_description));
    fd.append('long_description', JSON.stringify(createEditorDataForDB(data?.long_description)));

    const response = await $api.post(saveMissionURL, fd);
    return response.data;
  } catch (e) {
    return rejectedWithValue(e.message);
  }
});

const missionSlice = createSlice({
  name: 'mission',
  initialState: {
    mission: [],
    loading: false,
  },
  extraReducers: {
    [getMission.fulfilled]: (state, action) => {
      state.mission = action.payload;
    },
    [editMission.fulfilled]: (state, action) => {
      state.loading = false;
      notifySuccess(action.payload.message);
    },
    [editMission.pending]: (state, action) => {
      state.loading = true;
    },
  },
});

export default missionSlice.reducer;
