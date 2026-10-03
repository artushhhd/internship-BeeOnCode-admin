/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import { $api, API_URL } from '@api/http';
import { editShortCutsURL } from '@api/url';
import jwtService from '../auth/services/jwtService';

export const setUser = createAsyncThunk('admin/setUser', async (user, { dispatch, getState }) => {
  /*
    You can redirect the logged-in admin to a specific route depending on his role
    */
  if (user.loginRedirectUrl) {
    settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for dashboard 'apps/academy'
  }

  return user;
});

export const updateUserSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  'admin/updateShortucts',
  async (shortcuts, { dispatch, rejectWithValue, getState }) => {
    try {
      const fd = new FormData();
      const { user } = getState();

      fd.append('shortcuts', JSON.stringify(shortcuts));

      const newUser = { ...user, shortcuts };

      await $api.post(editShortCutsURL, fd);
      dispatch(updateUserData(newUser));

      return newUser;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: '/dashboard',
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  jwtService
    .updateUserData(user)
    // .then(() => {
    //   dispatch(showMessage({ message: 'User data saved with api' }));
    // })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

export const checkAuth = createAsyncThunk('checkAuth', async () => {
  const response = await $api.get(`${API_URL}/auth/refresh`);
  return response.data;
});

const initialState = {
  role: [], // guest
  // data: {
  //   displayName: 'John Doe',
  //   photoURL: 'assets/images/avatars/brian-hughes.jpg',
  //   email: 'johndoe@withinpixels.com',
  //   shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
  // },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
    [checkAuth.fulfilled]: (state, action) => {
      localStorage.setItem('jwt_access_token', action.payload.access_token);
      sessionStorage.setItem('jwt_access_token', action.payload.access_token);
      state.user = action.payload.user;
    },
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => {
  return user.shortcuts || [];
};

export default userSlice.reducer;
