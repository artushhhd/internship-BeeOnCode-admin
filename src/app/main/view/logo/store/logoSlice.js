import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { $api } from '@api/http';
import { deleteSectionURL, getSettingsURL, saveSettingsURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import LogoModel from '../model/LogoModel';

export const getLogo = createAsyncThunk('logoApp/task/getLogo', async () => {
  try {
    const response = await $api.get(getSettingsURL);

    return response.data.settings;
  } catch (error) {
    history.push({ pathname: `logos` });
    return null;
  }
});

export const addLogo = createAsyncThunk(
  'logoApp/logos/addLogo',
  async (logo, { dispatch, getState }) => {
    const response = await axios.post('/api/logos', logo);

    const data = await response.data;

    return data;
  }
);

export const updateLogo = createAsyncThunk('logoApp/logos/updateLogo', async (logo, thunkApi) => {
  try {
    const fd = new FormData();

    if (logo?.title) {
      fd.append('title', JSON.stringify(logo?.title));
    }

    if (logo?.logo_id) {
      fd.append('logo_id', JSON.stringify(logo?.logo_id));
    }

    if (logo?.gtag_id) {
      fd.append('gtag_id', logo?.gtag_id);
    }
    if (logo?.gmap_id) {
      fd.append('gmap_id', logo?.gmap_id);
    }
    if (logo?.id) {
      fd.append('settings_id', logo?.id);
    }

    if (logo?.partner_logo1_id) {
      fd.append('partner_logo1_id', logo?.partner_logo1_id);
    }

    if (logo?.partner_logo2_id) {
      fd.append('partner_logo2_id', logo?.partner_logo2_id);
    }

    if (logo?.partner_titles1) {
      fd.append('partner_titles1', JSON.stringify(logo?.partner_titles1));
    }

    if (logo?.partner_titles2) {
      fd.append('partner_titles2', JSON.stringify(logo?.partner_titles2));
    }

    if (logo?.partner_website1) {
      fd.append('partner_website1', logo?.partner_website1);
    }

    if (logo?.partner_website2) {
      fd.append('partner_website2', logo?.partner_website2);
    }

    if (logo?.favicon_id) {
      fd.append('favicon_id', logo?.favicon_id);
    }
    if (logo?.og_image_id) {
      fd.append('og_image_id', JSON.stringify(logo?.og_image_id));
    }

    // fd.append('site_mode', logo?.siteMode);

    const res = await $api.post(saveSettingsURL, fd);
    const response = await $api.get(getSettingsURL);
    const data = await response.data.settings;
    notifySuccess(res.data.message);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const removeLogo = createAsyncThunk('logoApp/logos/removeLogo', async (id, thunkApi) => {
  try {
    const response = await $api(deleteSectionURL, { id });

    await response.data;

    return id;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const selectLogo = ({ logoApp }) => {
  return logoApp.logo;
};

const logoSlice = createSlice({
  name: 'logoApp/logo',
  initialState: null,
  reducers: {
    newLogo: (state, action) => LogoModel(),
    resetLogo: () => null,
  },
  extraReducers: {
    [getLogo.pending]: (state, action) => null,
    [getLogo.fulfilled]: (state, action) => action.payload,
    [updateLogo.fulfilled]: (state, action) => action.payload,
    [updateLogo.rejected]: (state, action) => notifyError(action.payload),
    [removeLogo.fulfilled]: (state, action) => null,
  },
});

export const { resetLogo, newLogo } = logoSlice.actions;

export default logoSlice.reducer;
