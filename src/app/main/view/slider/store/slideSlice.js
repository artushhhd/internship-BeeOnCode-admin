import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { $api } from '@api/http';
import { addSlideURL, deleteSlideURL, editSlideURL, getSlidesURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import SlideModel from '../model/SlideModel';

export const getSlide = createAsyncThunk(
  'sliderApp/slides/getSlide',
  async (id, { dispatch, getState }) => {
    try {
      const response = await $api.get(getSlidesURL);
      let slide;
      response.data.slider.forEach((s) => {
        if (s.id === +id) {
          slide = s;
        }
      });
      return slide;
    } catch (error) {
      history.push({ pathname: `view/slider` });
      return null;
    }
  }
);

export const addSlide = createAsyncThunk('sliderApp/slides/addSlide', async (slide, thunkApi) => {
  try {
    const fd = new FormData();
    if (slide.video_url) {
      fd.append('video_url', slide.video_url);
    }
    if (slide.file) {
      if (slide.file_type === 'video/mp4') {
        fd.append('video_url', slide.file);
      } else {
        fd.append('file', slide.file);
      }
    }
    if (slide.chake === 'news') {
      fd.append('news_id', slide.news_id?.id);
    }
    if (slide.chake === 'page') {
      fd.append('page_id', slide.page_id?.id || -1);
    }
    if (slide.chake === 'area') {
      fd.append('area_id', slide.area_id?.id);
    }
    fd.append('is_cover', slide.is_cover || 1);
    fd.append('caption', JSON.stringify(createEditorDataForDB(slide.caption)));
    fd.append('button_text', JSON.stringify(slide.buttonText));
    fd.append('title', JSON.stringify(slide.title));
    fd.append('color', slide.color || '');
    fd.append('button_color', slide.buttonColor || '');
    fd.append('button_text_color', slide.textColor || '');
    fd.append('file_id', slide.file_id || 0);
    const response = await $api.post(addSlideURL, fd);
    const data = await response.data;

    return data.message;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});
export const updateSlide = createAsyncThunk(
  'sliderApp/slides/updateSlide',
  async (slide, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('id', slide?.id);
      fd.append('is_cover', slide.is_cover);
      if (slide.caption) {
        fd.append('caption', JSON.stringify(createEditorDataForDB(slide.caption)));
      }
      if (slide.buttonText) {
        fd.append('button_text', JSON.stringify(slide.buttonText));
      }
      if (slide.title) {
        fd.append('title', JSON.stringify(slide.title));
      }
      if (slide.buttonColor) {
        fd.append('button_color', slide.buttonColor);
      }
      if (slide.color) {
        fd.append('color', slide.color);
      }
      if (slide.textColor) {
        fd.append('button_text_color', slide.textColor);
      }

      if (slide.video_url) {
        fd.append('video_url', slide.video_url);
      }

      fd.append('file_id', slide.file_id || 0);

      if (slide.file_id) {
        if (slide.file_type === 'video/mp4') {
          fd.append('video_url', slide.file);
        } else {
          fd.append('file', slide.file);
          fd.append('video_url', '');
        }
      }
      if (slide.chake === 'news' && slide.news_id?.id) {
        fd.append('news_id', slide.news_id.id);
      } else if (slide.chake === 'news' && !slide.news_id?.id) {
        fd.append('news_id', slide.news_id);
      }
      if (slide.chake === 'page' && slide.page_id?.id) {
        fd.append('page_id', slide.page_id.id || -1);
      } else if (slide.chake === 'page' && !slide.page_id?.id) {
        fd.append('page_id', slide.page_id || -1);
      }
      if (slide.chake === 'area' && slide.area_id?.id) {
        fd.append('area_id', slide.area_id.id);
      } else if (slide.chake === 'area' && !slide.area_id?.id) {
        fd.append('area_id', slide.area_id);
      }

      const response = await $api.post(editSlideURL, fd);

      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const removeSlide = createAsyncThunk(
  'sliderApp/slides/removeSlide',
  async (id, { dispatch, getState }) => {
    const response = await $api.delete(`${deleteSlideURL}/${id}`);

    await response.data.message;

    return response.data.message;
  }
);

export const selectSlide = ({ sliderApp }) => {
  return sliderApp.slide;
};

const slideSlice = createSlice({
  name: 'sliderApp/slide',
  initialState: null,
  reducers: {
    newSlide: (state, action) => SlideModel(),
    resetSlide: () => null,
  },
  extraReducers: {
    [getSlide.pending]: (state, action) => null,
    [getSlide.fulfilled]: (state, action) => action.payload,
    [addSlide.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addSlide.rejected]: (state, action) => notifyError(action.payload),
    [updateSlide.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateSlide.rejected]: (state, action) => notifyError(action.payload),
    [removeSlide.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeSlide.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { resetSlide, newSlide } = slideSlice.actions;

export default slideSlice.reducer;
