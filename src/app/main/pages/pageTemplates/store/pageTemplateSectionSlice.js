import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {
  addPageTemplateSectionTabURL,
  addPageTemplateSectionURL,
  addPageTemplatesSectionAccordionURL,
  deletePageSectionsSectionTabURL,
  deletePageSectionsSectionURL,
  deletePageTemplateSectionAccordionURL,
} from '@api/url';
import PageTemplateSectionModel from '../model/PageTemplateSectionsModel';

export const addPageTemplateSection = createAsyncThunk(
  'PageTemplatesApp/sections/addSection',
  async (section, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('type', section.type);
      fd.append('template_id', section.templateId);
      fd.append('tab_id', section.tabId || 0);
      fd.append('accordion_id', section.accordionId || 0);

      const response = await $api.post(addPageTemplateSectionURL, fd);
      const { message } = response.data;
      return message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const removePageTemplateSection = createAsyncThunk(
  'PageTemplatesApp/sections/removeSection',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deletePageSectionsSectionURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const addTabInSection = createAsyncThunk(
  'PageTemplatesApp/section/tab/add',
  async (data, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('section_id', data.section_id);
      // fd.append('title', JSON.stringify(data.title));

      const response = await $api.post(addPageTemplateSectionTabURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const deleteTabInSection = createAsyncThunk(
  'PageTemplatesApp/section/tab/delete',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deletePageSectionsSectionTabURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const addAccordionInSection = createAsyncThunk(
  'PageTemplatesApp/section/accordion/add',
  async (data, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('section_id', data.section_id);

      const response = await $api.post(addPageTemplatesSectionAccordionURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const deleteAccordionInSection = createAsyncThunk(
  'PageTemplatesApp/section/accordion/delete',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deletePageTemplateSectionAccordionURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const PageTemplateSectionSlice = createSlice({
  name: 'pageSection',
  initialState: null,
  reducers: {
    setSectionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    newPageSection: (state, action) => PageTemplateSectionModel(),
    resetSection: () => null,
  },
  extraReducers: {
    [addPageTemplateSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addPageTemplateSection.rejected]: (state, action) => notifyError(action.payload),

    [removePageTemplateSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removePageTemplateSection.rejected]: (state, action) => notifyError(action.payload),

    [addTabInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addTabInSection.rejected]: (state, action) => notifyError(action.payload),

    [deleteTabInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [deleteTabInSection.rejected]: (state, action) => notifyError(action.payload),

    [addAccordionInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addAccordionInSection.rejected]: (state, action) => notifyError(action.payload),

    [deleteAccordionInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [deleteAccordionInSection.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { newPageSection } = PageTemplateSectionSlice.actions;

export default PageTemplateSectionSlice.reducer;
