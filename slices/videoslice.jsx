
import { createSlice } from "@reduxjs/toolkit";
import data from '../videos.json'

const initialState ={
    videos: data,
    selected:null,
    reels:null
}

const videoSlice = createSlice({
    name:'video',
    initialState,
    reducers:{
        addVideo(state,action){
          state.videos = [...state.videos,action.payload]
        },
        selectVideo(state,action){
            state.selected = action.payload;
        },
        addReels(state,action){
            state.reels = action.payload;
        },
        addComment(state,action){
            const{videoId,commentInfo} = action.payload;
            const video = state.videos.find((video)=>video.id === videoId)
            if(video){
                if (!video.comments) {
                    video.comments = [];
                }
                video.comments.push(commentInfo);
            }
        },
        removeComment(state, action) {
            const { videoId, commentId } = action.payload;
            const video = state.videos.find((video) => video.id === videoId);
            if (video && video.comments) {
              video.comments = video.comments.filter((video) => video.commentId !== commentId);
            }
        },
    }
})

export const{addVideo,selectVideo,addComment,addReels,removeComment} = videoSlice.actions;
export default videoSlice.reducer;
