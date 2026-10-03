import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { $api } from '@api/http';
import { getFAQURL, editFAQURL, orderFAQURL, deleteFAQURL, addFAQURL } from '@api/url';
import { notifyError, notifySuccess } from '@helpers/toast';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import FAQModel from '../model/FAQModel';

export const getFAQ = createAsyncThunk('FAQApp/task/getFAQ', async (id, { dispatch, getState }) => {
  try {
    const response = await $api.get(getFAQURL);
    return response.data.faq.find((val) => val.id === +id);
  } catch (error) {
    history.push({ pathname: `view/faq` });
    return null;
  }
});

export const addFAQ = createAsyncThunk('FAQsApp/FAQs/addFAQ', async (faq, thunkApi) => {
  try {
    const fd = new FormData();
    fd.append('question', JSON.stringify(faq?.question));
    fd.append('answer', JSON.stringify(createEditorDataForDB(faq?.answer)));

    // fd.append('plain_content', JSON.stringify(getPlain(faq?.answer)));
    const response = await $api.post(addFAQURL, fd);
    return response.data.message;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateFAQ = createAsyncThunk('FAQsApp/FAQs/updateFAQ', async (faq, thunkApi) => {
  try {
    const fd = new FormData();

    fd.append('id', faq?.id);

    fd.append('question', JSON.stringify(faq?.question));

    fd.append('plainContent', JSON.stringify(faq?.answer));
    fd.append('answer', JSON.stringify(createEditorDataForDB(faq?.answer)));

    const response = await $api.post(editFAQURL, fd);

    return 'The FAQ Successfully edited';
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const changeOrderFAQ = createAsyncThunk(
  'FAQApp/FAQ/changeOrderFAQ',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(orderFAQURL, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const removeFAQ = createAsyncThunk('FAQApp/FAQ/removeFAQ', async (id, thunkApi) => {
  try {
    const response = await $api.delete(`${deleteFAQURL}/${id}`);
    return 'The FAQ Successfully deleted';
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const selectFAQ = ({ FAQApp }) => {
  return FAQApp.faq;
};

const FAQSlice = createSlice({
  name: 'FAQsApp/FAQ',
  initialState: null,
  reducers: {
    newFAQ: (state, action) => FAQModel(),
    resetFAQ: () => null,
  },
  extraReducers: {
    [getFAQ.pending]: (state, action) => null,
    [getFAQ.fulfilled]: (state, action) => action.payload,
    [addFAQ.fulfilled]: (state, action) => notifySuccess(action.payload),
    [addFAQ.rejected]: (state, action) => notifyError(action.payload),
    [updateFAQ.fulfilled]: (state, action) => notifySuccess(action.payload),
    [updateFAQ.rejected]: (state, action) => notifyError(action.payload),
    [removeFAQ.fulfilled]: (state, action) => notifySuccess(action.payload),
    [removeFAQ.rejected]: (state, action) => notifyError(action.payload),
    [changeOrderFAQ.fulfilled]: (state, action) => notifySuccess(action.payload),
  },
});

export const { resetFAQ, newFAQ } = FAQSlice.actions;

export default FAQSlice.reducer;
