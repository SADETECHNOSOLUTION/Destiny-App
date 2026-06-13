import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

const initialState = {
    postcomments:[],
    videocomments:[]
}

const commentslice = createSlice({
    name:'comment',
    initialState,
    reducers:{
    updatePostComment(state) {
        state.postcomments = state.postcomments.map((comment) => ({
          ...comment,
          timestamp: moment().toISOString(),
        }));
      },

    }
})

export const {addPhotoComment,addVideoComment,updatePostComment,deleteComment} = commentslice.actions
export default commentslice.reducer
