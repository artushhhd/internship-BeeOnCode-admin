import { createAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import i18n from 'src/i18n';
import _ from '@lodash';
import { $api } from '@api/http';
import { getLanguagesURL } from '@api/url';
import { setDefaultSettings } from './fuse/settingsSlice';

export const getTranslationLanguages = createAsyncThunk(
  'getTranslationLanguages',
  async (params, { getState }) => {
    const response = await $api.get(getLanguagesURL);
    const data = await response.data;
    return data.languages;
  }
);

export const changeTranslationLanguage = createAction('changeTranslationLanguages', ({ id }) => {
  return { payload: id };
});

export const changeTranslationLanguageInModal = createAction(
  'changeTranslationLanguageInModal',
  ({ id }) => {
    return { payload: id };
  }
);

export const changeLanguage = (languageId) => (dispatch, getState) => {
  const { direction } = getState().fuse.settings.defaults;

  const newLangDirection = i18n.dir(languageId);

  /*
    If necessary, change theme direction
     */
  if (newLangDirection !== direction) {
    dispatch(setDefaultSettings({ direction: newLangDirection }));
  }

  /*
    Change Language
     */
  return i18n.changeLanguage(languageId).then(() => {
    dispatch(i18nSlice.actions.languageChanged(languageId));
  });
};

const i18nSlice = createSlice({
  name: 'i18n',
  initialState: {
    language: localStorage.getItem('language_slug') || i18n.options.lng,
    languages: [
      { index: 0, id: 'am', title: 'Armenian', flag: 'AM' },
      { index: 1, id: 'en', title: 'English', flag: 'UK' },
    ],
    translationLanguages: [],
    translationLanguage: 1,
    translationLanguageInModal: 1,
  },
  reducers: {
    languageChanged: (state, action) => {
      localStorage.setItem('language_slug', action.payload);
      state.language = action.payload;
    },
  },
  extraReducers: {
    [getTranslationLanguages.fulfilled.type]: (state, action) => {
      if (!_.isEqual(state.translationLanguages, action.payload)) {
        state.translationLanguages = action.payload;
      }
    },
    [changeTranslationLanguage]: (state, action) => {
      state.translationLanguage = action.payload;
    },
    [changeTranslationLanguageInModal]: (state, action) => {
      state.translationLanguageInModal = action.payload;
    },
  },
});

export const selectCurrentLanguageId = ({ i18n: _i18n }) => _i18n.language;

export const selectLanguages = ({ i18n: _i18n }) => _i18n.languages;

export const selectCurrentLanguageDirection = createSelector([selectCurrentLanguageId], (id) => {
  return i18n.dir(id);
});

export const selectCurrentLanguage = createSelector(
  [selectCurrentLanguageId, selectLanguages],
  (id, languages) => {
    return languages.find((lng) => lng.id === id);
  }
);

export default i18nSlice.reducer;
