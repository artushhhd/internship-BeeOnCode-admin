import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { $api } from '@api/http';
import { getSocialsURL, orderSocialURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';

export const getSocials = createAsyncThunk(
  'socialsApp/socials/getSocials',
  async (params, { getState }) => {
    const response = await $api.get(getSocialsURL);

    const data = await response.data;

    return { data: data.socials };
  }
);

export const changeOrderSocials = createAsyncThunk(
  'socialsApp/socials/changeOrderSocials',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(orderSocialURL, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const socialsAdapter = createEntityAdapter({});

export const selectSearchText = ({ socialsApp }) => {
  return socialsApp.socials.searchText;
};

export const { selectAll: selectSocials, selectById: selectSocialsById } =
  socialsAdapter.getSelectors((state) => state.socialsApp.socials);

export const selectFilteredSocials = createSelector(
  [selectSocials, selectSearchText],
  (socials, searchText) => {
    if (searchText.length === 0) {
      return socials;
    }
    return FuseUtils.filterArrayByString(socials, searchText);
  }
);

export const selectGroupedFilteredSocials = createSelector([selectFilteredSocials], (socials) => {
  return (
    socials
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
});

const socialsSlice = createSlice({
  name: 'socialsApp/socials',
  initialState: socialsAdapter.getInitialState({
    searchText: '',
    socials: [],
  }),
  reducers: {
    setSocialsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [changeOrderSocials.fulfilled]: (state, action) => notifySuccess(action.payload),
    [changeOrderSocials.rejected]: (state, action) => notifyError(action.payload),
    [getSocials.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      socialsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setSocialsSearchText } = socialsSlice.actions;

export default socialsSlice.reducer;
