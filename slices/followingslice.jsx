import { createSlice } from "@reduxjs/toolkit";
import data from '../following.json';

const initialState = {
    Following: data
};

const followingSlice = createSlice({
    name: 'following',
    initialState,
    reducers: {
        unFollow(state, action) {
            state.Following = state.Following.filter(follow => follow.id !== action.payload);
        }
    }
});

export const { unFollow } = followingSlice.actions;
export default followingSlice.reducer;
