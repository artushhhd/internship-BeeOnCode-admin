import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import { $api } from '@api/http';
import {
  addPagesSectionAccordionURL,
  addPagesSectionTabURL,
  addPagesSectionURL,
  deletePagesSectionAccordionURL,
  deletePagesSectionTabURL,
  deletePagesSectionURL,
  editPagesFileSectionFileURL,
  editPagesSectionAccordionURL,
  editPagesSectionTabURL,
  editPagesSectionURL,
  getSectionURL,
  pageAccordionsOrderUrl,
  pageFilesOrderUrl,
  pageGalleryOrderUrl,
  pageLinkOrderUrl,
  pageTabsOrderUrl,
} from '@api/url';
import PageSectionModel from '../model/PageSectionsModel';

// const sectionAdapter = createEntityAdapter({});

export const getPageSection = createAsyncThunk(
  'PageApp/sections/getSection',
  async ({ id, sectionId, tabId, accordionId }, { dispatch, getState }) => {
    try {
      const response = await $api.get(`${getSectionURL}/${id}`);

      if (tabId) {
        return response.data.sections
          .filter((val) => val.type === 'tab')
          .find((val) => val.tabs.some((tab) => tab.id === +tabId))
          .tabs.find((val) => val.id === +tabId)
          .sections.find((val) => val.id === +sectionId);
      }

      if (accordionId) {
        return response.data.sections
          .filter((val) => val.type === 'accordion')
          .find((val) => val.accordion.some((accordion) => accordion.id === +accordionId))
          .accordion.find((val) => val.id === +accordionId)
          .sections.find((val) => val.id === +sectionId);
      }

      return response.data.sections.find((val) => val.id === +sectionId);
    } catch (error) {
      // history.push({ pathname: `view/section` });
      return null;
    }
  }
);

export const selectPageSection = ({ PagesApp }) => {
  console.log(PagesApp);
  return PagesApp.section;
};

export const addPageSection = createAsyncThunk(
  'PageApp/sections/addSection',
  async (section, thunkApi) => {
    console.log(section, 321);
    try {
      const fd = new FormData();
      fd.append('type', section.type);
      fd.append('page_id', section.pageId);
      fd.append('tab_id', section.tabId || 0);
      fd.append('accordion_id', section.accordionId || 0);
      fd.append('title', JSON.stringify(section.title));

      if (section.type === 'text') {
        fd.append('text', JSON.stringify(createEditorDataForDB(section.content)));
        // fd.append('plainText', JSON.stringify(getPlain(section.content)));
      }
      if (section.type === 'gallery') {
        console.log(section?.link, 'section?.galleryArr');
        section?.galleryArr.forEach((img) => {
          fd.append('image_gallery_id[]', JSON.stringify(img));
        });

        section.link.forEach((val) => {
          fd.append('titles[]', val.titles || '');
          fd.append('category_id[]', val?.category_id || 0);
          fd.append('language_id[]', val.lang_id);
        });
      }
      if (section.type === 'file') {
        section?.files?.forEach((f) => {
          fd.append('files_id[]', f.id);
          fd.append('name[]', f.name);
          fd.append('covers_id[]', f?.cover?.id || 0);
          fd.append('language_id[]', f.language_id);
        });
      }
      if (section.type === 'map') {
        fd.append('longitude', section.longitude);
        fd.append('latitude', section.latitude);
      }
      if (section.type === 'line') {
        fd.append('color', section.color);
        fd.append('height', section.height);
        fd.append('line_type', section.lineType);
      }

      if (section.type === 'link') {
        section.link.forEach((val) => {
          fd.append('name[]', val.name);
          fd.append('is_name_visible', 1);
          fd.append('covers_id[]', val?.cover ? val.cover.id : 0);
          fd.append('pages_id[]', val?.page_id ? val?.page_id : '');
          fd.append('link[]', val?.url ? val.url : '');

          fd.append('language_id[]', val.lang_id);
        });
      }

      const response = await $api.post(addPagesSectionURL, fd);
      const { message } = response.data;
      return message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const updatePageSection = createAsyncThunk(
  'PageApp/sections/updateSection',
  async (section, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('id', section?.id);
      fd.append('title', JSON.stringify(section?.title));
      fd.append('type', section.type);

      if (section.type === 'gallery') {
        section?.galleryArr.forEach((img) => {
          fd.append('image_gallery_id[]', JSON.stringify(img));
        });

        section.link.forEach((val) => {
          fd.append('titles[]', val.titles || '');
          fd.append('category_id[]', val?.category_id || 0);
          fd.append('language_id[]', val.lang_id);
        });
      }

      if (section.type === 'file') {
        section?.files?.forEach((f) => {
          fd.append('files_id[]', f.id);
          fd.append('name[]', f.name);
          fd.append('covers_id[]', f?.cover?.id || 0);
          fd.append('language_id[]', f.language_id);
        });
      }
      if (section.type === 'map') {
        fd.append('longitude', section.longitude);
        fd.append('latitude', section.latitude);
      }
      if (section.type === 'text') {
        fd.append('text', JSON.stringify(createEditorDataForDB(section.content)));
        // fd.append('plainText', JSON.stringify(getPlain(section.content)));
      }
      if (section.type === 'line') {
        fd.append('color', section.color);
        fd.append('height', section.height);
        fd.append('line_type', section.lineType);
      }

      if (section.type === 'link') {
        section.link.forEach((val) => {
          fd.append('name[]', val.name);
          fd.append('is_name_visible', 1);
          fd.append('covers_id[]', val?.cover ? val.cover.id : 0);
          fd.append('pages_id[]', val?.page_id ? val?.page_id : '');
          fd.append('link[]', val?.url ? val.url : '');

          fd.append('language_id[]', val.lang_id);
        });
      }

      const response = await $api.post(editPagesSectionURL, fd);

      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const editSingleFileName = createAsyncThunk(
  'PageApp/sections/editFileName',
  async ({ id, name, file }, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('file_id', id);
      fd.append('name', name);

      const response = await $api.post(editPagesFileSectionFileURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const removePageSection = createAsyncThunk(
  'PageApp/sections/removeSection',
  async ({ id }, thunkApi) => {
    try {
      const response = await $api.delete(`${deletePagesSectionURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const addTabInSection = createAsyncThunk(
  'PageApp/section/tab/add',
  async (data, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('section_id', data.section_id);
      fd.append('title', JSON.stringify(data.name));

      const response = await $api.post(addPagesSectionTabURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const editTabInSection = createAsyncThunk(
  'PageApp/section/tab/edit',
  async (data, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('id', data.id);
      fd.append('title', JSON.stringify(data.name));

      const response = await $api.post(editPagesSectionTabURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const deleteTabInSection = createAsyncThunk(
  'PageApp/section/tab/delete',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deletePagesSectionTabURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const changeOrderTabs = createAsyncThunk(
  'pageApp/section/changeOrderTabs',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(pageTabsOrderUrl, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const addAccordionInSection = createAsyncThunk(
  'PageApp/section/accordion/add',
  async (data, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('section_id', data.section_id);
      fd.append('title', JSON.stringify(data.name));

      const response = await $api.post(addPagesSectionAccordionURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const editAccordionInSection = createAsyncThunk(
  'PageApp/section/accordion/edit',
  async (data, thunkApi) => {
    try {
      const fd = new FormData();

      fd.append('id', data.id);
      fd.append('title', JSON.stringify(data.name));

      const response = await $api.post(editPagesSectionAccordionURL, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const changeOrderAccordions = createAsyncThunk(
  'pageApp/section/changeOrderAccordions',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const response = await $api.post(pageAccordionsOrderUrl, fd);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const deleteAccordionInSection = createAsyncThunk(
  'PageApp/section/accordion/delete',
  async (id, thunkApi) => {
    try {
      const response = await $api.delete(`${deletePagesSectionAccordionURL}/${id}`);
      return response.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const changeOrderFile = createAsyncThunk(
  'pageApp/sections/changeOrderFile',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const res = await $api.post(pageFilesOrderUrl, fd);
      return res.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);
export const changeOrderLink = createAsyncThunk(
  'pageApp/sections/changeOrderLink',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const res = await $api.post(pageLinkOrderUrl, fd);
      return res.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);
export const changeOrderGallery = createAsyncThunk(
  'pageApp/sections/changeOrderGallery',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      const res = await $api.post(pageGalleryOrderUrl, fd);
      return res.data.message;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const PageSectionSlice = createSlice({
  name: 'pageSection',
  initialState: {
    galleryObj: [],
  },
  reducers: {
    setGalleryObj: {
      reducer: (state, action) => {
        state.galleryObj = action.payload;
      },
    },
    setSectionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    newPageSection: (state, action) => PageSectionModel(),
    resetSection: () => null,
  },
  extraReducers: {
    [getPageSection.pending]: (state, action) => null,
    [getPageSection.fulfilled]: (state, action) => action.payload,
    [addPageSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addPageSection.rejected]: (state, action) => notifyError(action.payload),
    [updatePageSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updatePageSection.rejected]: (state, action) => notifyError(action.payload),
    [removePageSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removePageSection.rejected]: (state, action) => notifyError(action.payload),
    [addTabInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addTabInSection.rejected]: (state, action) => notifyError(action.payload),
    [editTabInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [editTabInSection.rejected]: (state, action) => notifyError(action.payload),
    [addAccordionInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addAccordionInSection.rejected]: (state, action) => notifyError(action.payload),
    [editAccordionInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [editAccordionInSection.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderTabs.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderTabs.rejected]: (state, action) => notifyError(action.payload),
    [deleteTabInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [deleteTabInSection.rejected]: (state, action) => notifyError(action.payload),
    [deleteAccordionInSection.fulfilled]: (state, action) => notifySuccess(action.payload),
    [deleteAccordionInSection.rejected]: (state, action) => notifyError(action.payload),
    [editSingleFileName.fulfilled]: (state, action) => notifySuccess(action.payload),
    [editSingleFileName.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderFile.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderFile.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderLink.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderLink.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderGallery.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderGallery.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderAccordions.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderAccordions.rejected]: (state, action) => notifyError(action.payload),
  },
});

export const { newPageSection, resetSection, setGalleryObj } = PageSectionSlice.actions;

export default PageSectionSlice.reducer;
