import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';
import { getSettingsURL } from '@api/url';
import { addLogo, removeLogo, updateLogo } from './logoSlice';

export const getLogos = createAsyncThunk('logoApp/logos/getLogos', async (params, { getState }) => {
  const response = await $api.get(getSettingsURL);
  const data = await response.data;

  return { data: [data.settings] };
});

const logosAdapter = createEntityAdapter({});

export const selectSearchText = ({ logoApp }) => {
  return logoApp.logos.searchText;
};

export const { selectAll: selectLogos, selectById: selectLogosById } = logosAdapter.getSelectors(
  (state) => state.logoApp.logos
);

export const selectFilteredLogos = createSelector(
  [selectLogos, selectSearchText],
  (logos, searchText) => {
    if (searchText.length === 0) {
      return logos;
    }
    return FuseUtils.filterArrayByString(logos, searchText);
  }
);

export const selectGroupedFilteredLogos = createSelector([selectFilteredLogos], (logos) => {
  return logos
    .sort((a, b) =>
      a.translations[0].title.localeCompare(b.translations[0].title, 'es', { sensitivity: 'base' })
    )
    .reduce((r, e) => {
      // get first letter of name of current element
      const group = e.translations[0].title[0];
      // if there is no property in accumulator with this letter create it
      if (!r[group]) r[group] = { group, children: [e] };
      // if there is push current element to children array for that letter
      else r[group].children.push(e);
      // return accumulator
      return r;
    }, {});
});

const logosSlice = createSlice({
  name: 'logoApp/logos',
  initialState: logosAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setLogosSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateLogo.fulfilled]: logosAdapter.upsertOne,
    [addLogo.fulfilled]: logosAdapter.addOne,
    [removeLogo.fulfilled]: (state, action) => logosAdapter.removeOne(state, action.payload),
    [getLogos.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      logosAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setLogosSearchText } = logosSlice.actions;

export default logosSlice.reducer;
