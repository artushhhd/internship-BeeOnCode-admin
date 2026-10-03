import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { notifyError, notifySuccess } from '@helpers/toast';
import { getSlidesURL, orderSlideUrl } from '@api/url';
import { $api } from '@api/http';

export const getSlides = createAsyncThunk(
  'sliderApp/slides/getSlides',
  async (params, thunkApi) => {
    try {
      const response = await $api.get(getSlidesURL);

      const data = await response.data.slider;
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const reorderSlider = createAsyncThunk(
  'sliderApp/slides/reorderSlider',
  async (array, thunkApi) => {
    console.log('arrayslider', array);

    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(orderSlideUrl, fd);
      const data = await response.data.slider;

      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const sliderAdapter = createEntityAdapter({});

export const { selectAll: selectSlider, selectById: selectSliderById } = sliderAdapter.getSelectors(
  (state) => state.sliderApp.slider
);

const sliderSlice = createSlice({
  name: 'sliderApp/slides',
  initialState: sliderAdapter.getInitialState({
    loading: false,
  }),
  extraReducers: {
    // [reorderSlider.fulfilled]: (state, action) => notifySuccess('text'),
    [reorderSlider.rejected]: (state, action) => notifyError(action.payload),

    // [updateSlide.fulfilled]: sliderAdapter.upsertOne,
    // [updateSlide.rejected]: (state, action) => notifyError(action.payload),

    [getSlides.pending]: (state) => {
      state.loading = true;
    },
    [getSlides.fulfilled]: (state, action) => {
      sliderAdapter.setAll(state, action.payload);
      state.loading = false;
    },
    [getSlides.rejected]: (state) => {
      state.loading = false;
    },

    [reorderSlider.pending]: (state) => {
      state.loading = true;
    },
    [reorderSlider.fulfilled]: (state, action) => {
      sliderAdapter.setAll(state, action.payload);
      state.loading = false;
      notifySuccess('Orders are successfully changed');
    },
    [reorderSlider.rejected]: (state) => {
      state.loading = false;
    },
  },
});

// export const { setTasksSearchText } = sliderSlice.actions;

export default sliderSlice.reducer;
