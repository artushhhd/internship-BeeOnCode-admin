import { createSlice } from '@reduxjs/toolkit';

const nestedDraggableSlice = createSlice({
  name: 'nestedDraggable',
  initialState: {
    nestedDraggable: {},
  },
  reducers: {
    changeNestedDraggable: (state, action) => {
      Object.keys(state.nestedDraggable).forEach((key) => {
        state.nestedDraggable[key] = false;
      });

      state.nestedDraggable = {
        ...state.nestedDraggable,
        [action.payload.key]: action.payload.value,
      };
    },
  },
});

export const { changeNestedDraggable } = nestedDraggableSlice.actions;

export default nestedDraggableSlice.reducer;
