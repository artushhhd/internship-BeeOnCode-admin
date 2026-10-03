import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';
import { getAnnouncementURL } from '@api/url';
import { addAnnouncement, removeAnnouncement, updateAnnouncement } from './announcementSlice';

export const getAnnouncements = createAsyncThunk(
  'AnnouncementsApp/Announcements/getAnnouncement',
  async (params, { getState }) => {
    const response = await $api.get(getAnnouncementURL);
    const data = await response.data;
    return { data: data.announcements };
  }
);

const AnnouncementAdapter = createEntityAdapter({});

export const selectSearchText = ({ AnnouncementApp }) => {
  return AnnouncementApp.announcements?.searchText;
};

export const { selectAll: selectAnnouncements, selectById: selectAnnouncementsById } =
  AnnouncementAdapter.getSelectors((state) => state.AnnouncementApp.announcements);

export const selectFilteredAnnouncements = createSelector(
  [selectAnnouncements, selectSearchText],
  (announcements, searchText = []) => {
    if (searchText.length === 0) {
      return announcements;
    }
    return FuseUtils.filterArrayByString(announcements, searchText);
  }
);

export const selectGroupedFilteredAnnouncements = createSelector(
  [selectFilteredAnnouncements],
  (announcements) => {
    return announcements;
  }
);

const AnnouncementsSlice = createSlice({
  name: 'announcementsApp/announcements',
  initialState: AnnouncementAdapter.getInitialState({
    searchText: '',
    loading: false,
  }),
  reducers: {
    setAnnouncementsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateAnnouncement.fulfilled]: AnnouncementAdapter.upsertOne,
    [addAnnouncement.fulfilled]: AnnouncementAdapter.addOne,
    [removeAnnouncement.fulfilled]: (state, action) =>
      AnnouncementAdapter.removeOne(state, action.payload),
    [getAnnouncements.pending]: (state) => {
      state.loading = true;
    },
    [getAnnouncements.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      AnnouncementAdapter.setAll(state, data);
      state.searchText = '';
      state.loading = false;
    },
    [getAnnouncements.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { setAnnouncementsSearchText } = AnnouncementsSlice.actions;

export default AnnouncementsSlice.reducer;
