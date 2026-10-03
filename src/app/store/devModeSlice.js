import { createSlice } from '@reduxjs/toolkit';

const devModeSlice = createSlice({
  name: 'devmode',
  initialState: {
    devMode: false,
  },
  reducers: {
    changeDevMode: (state, action) => {
      state.devMode = !state.devMode;
    },
  },
});

export const { changeDevMode } = devModeSlice.actions;

export default devModeSlice.reducer;
