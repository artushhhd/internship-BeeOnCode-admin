import { createSlice } from '@reduxjs/toolkit';

const RightBarSlice = createSlice({
  name: 'rightBar',
  initialState: {
    maximize: false,
    languages: true,
  },
  reducers: {
    changeMaximize: (state, action) => {
      state.maximize = action.payload ? action.payload.maximize : !state.maximize;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
  },
});

export const { changeMaximize, setLanguages } = RightBarSlice.actions;

export default RightBarSlice.reducer;
