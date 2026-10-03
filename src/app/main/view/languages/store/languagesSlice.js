import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';
import { getLanguagesURL, orderLanguageURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import { removeLanguage } from './languageSlice';

export const getLanguages = createAsyncThunk(
  'languagesApp/languages/getLanguages',
  async (params, { getState }) => {
    const response = await $api.get(getLanguagesURL);

    const data = await response.data;

    return { data: data.languages };
  }
);

export const changeOrderLanguages = createAsyncThunk(
  'languagesApp/languages/changeOrderLanguages',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(orderLanguageURL, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const languagesAdapter = createEntityAdapter({});

export const selectSearchText = ({ languagesApp }) => {
  return languagesApp.languages.searchText;
};

export const { selectAll: selectLanguages, selectById: selectLanguagesById } =
  languagesAdapter.getSelectors((state) => state.languagesApp.languages);

export const selectFilteredLanguages = createSelector(
  [selectLanguages, selectSearchText],
  (languages, searchText) => {
    if (searchText.length === 0) {
      return languages;
    }
    return FuseUtils.filterArrayByString(languages, searchText);
  }
);

export const selectGroupedFilteredLanguages = createSelector(
  [selectFilteredLanguages],
  (languages) => {
    return (
      languages
        // .sort((a, b) => a.name.localeCompare(b.id, 'es', { sensitivity: 'base' }))
        .reduce((r, e) => {
          // get first letter of name of current element
          const group = e.name[0];
          // if there is no property in accumulator with this letter create it
          if (!r[group]) r[group] = { group, children: [e] };
          // if there is push current element to children array for that letter
          else r[group].children.push(e);
          // return accumulator
          return r;
        }, {})
    );
  }
);

const languagesSlice = createSlice({
  name: 'languagesApp/languages',
  initialState: languagesAdapter.getInitialState({
    searchText: '',
    languages: [],
    loading: false,
  }),
  reducers: {
    setLanguagesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    // [updateLanguage.fulfilled]: languagesAdapter.upsertOne,
    // [addLanguage.fulfilled]: languagesAdapter.addOne,

    [changeOrderLanguages.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderLanguages.rejected]: (state, action) => notifyError(action.payload),
    [removeLanguage.fulfilled]: (state, action) =>
      languagesAdapter.removeOne(state, action.payload),
    [getLanguages.pending]: (state, action) => {
      state.loading = true;
    },
    [getLanguages.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      languagesAdapter.setAll(state, data);
      state.searchText = '';
      state.loading = false;
    },
    [getLanguages.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { setLanguagesSearchText } = languagesSlice.actions;

export default languagesSlice.reducer;
