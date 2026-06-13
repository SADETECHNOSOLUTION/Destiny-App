import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedStory: null,
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    selectStory(state, action) {
      state.selectedStory = action.payload;
    },
  },
});

export const { selectStory } = storySlice.actions;

export default storySlice.reducer;
