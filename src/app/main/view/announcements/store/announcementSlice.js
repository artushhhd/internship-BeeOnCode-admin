import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { $api } from '@api/http';
import {
  getAnnouncementURL,
  addAnnouncementURL,
  editAnnouncementURL,
  orderAnnouncementURL,
  deleteAnnouncementURL,
  editAnnouncemenStatusURL,
} from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import AnnouncementModel from '../model/AnnouncementModel';

export const getAnnouncement = createAsyncThunk(
  'AnnouncementApp/task/getAnnouncement',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(getAnnouncementURL);
      return response.data.announcements.find((val) => val.id === +id);
    } catch (error) {
      history.push({ pathname: `view/announcement` });
      return null;
    }
  }
);

export const addAnnouncement = createAsyncThunk(
  'AnnouncementsApp/Announcements/addAnnouncement',
  async (announcement, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('text', JSON.stringify(createEditorDataForDB(announcement?.text)));
      fd.append('is_permanent', announcement.is_permanent);
      const response = await $api.post(addAnnouncementURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'AnnouncementsApp/Announcements/updateAnnouncement',
  async (announcement, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('id', announcement?.id);
      fd.append('is_permanent', announcement.is_permanent);
      fd.append('text', JSON.stringify(createEditorDataForDB(announcement?.text)));

      const response = await $api.post(editAnnouncementURL, fd);

      return 'The Announcement Successfully edited';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const editAnnouncemenStatus = createAsyncThunk(
  'announcemen/changeStatus',
  async (item, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', item.id);
    fd.append('status', item.status ? 0 : 1);

    const response = await $api.post(editAnnouncemenStatusURL, fd);

    const data = await response.data.message;

    return data;
  }
);

export const changeOrderAnnouncement = createAsyncThunk(
  'AnnouncementApp/Announcement/changeOrderAnnouncement',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(orderAnnouncementURL, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const removeAnnouncement = createAsyncThunk(
  'AnnouncementApp/Announcement/removeAnnouncement',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deleteAnnouncementURL}/${id}`);
      return 'The Announcement Successfully deleted';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const selectAnnouncement = ({ AnnouncementApp }) => {
  return AnnouncementApp.announcement;
};

const AnnouncementSlice = createSlice({
  name: 'AnnouncementsApp/Announcement',
  initialState: null,
  reducers: {
    newAnnouncement: (state, action) => AnnouncementModel(),
    resetAnnouncement: () => null,
  },
  extraReducers: {
    [getAnnouncement.pending]: (state, action) => null,
    [getAnnouncement.fulfilled]: (state, action) => action.payload,
    [addAnnouncement.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addAnnouncement.rejected]: (state, action) => notifyError(action.payload),
    [updateAnnouncement.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateAnnouncement.rejected]: (state, action) => notifyError(action.payload),
    [removeAnnouncement.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeAnnouncement.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderAnnouncement.fulfilled]: (state, action) => notifySuccess(action.payload),
    [editAnnouncemenStatus.fulfilled]: (state, action) => notifySuccess(action.payload),
  },
});

export const { resetAnnouncement, newAnnouncement } = AnnouncementSlice.actions;

export default AnnouncementSlice.reducer;
