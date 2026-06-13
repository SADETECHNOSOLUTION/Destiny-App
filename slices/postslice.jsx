import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    selected:null
}

const postslice = createSlice({
    name:'post',
    initialState,
    reducers:{
    selectPost(state,action){
        state.selected = action.payload
    },
    removeSelected(state) {
        state.selected = null;
    },
    }
})

export const {selectPost,removeSelected} = postslice.actions
export default postslice.reducer