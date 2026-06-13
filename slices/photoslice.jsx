import { createSlice } from "@reduxjs/toolkit";
import data from '../photos.json'
import posts from '../posts.json'
import { update } from "react-spring";

const initialState = {
    uploaded: data,
    selected: null,
    folders: [],
    profilepic: null,
    selectedprofilepic: null,
    coverpic:null,
    story:null,
    selectedcoverpic:null,
    newsfeed:posts,
    selectedphotocomment:null,
    saved:[]
}

const photoslice = createSlice({
    name: 'photo',
    initialState,
    reducers: {
        addPhoto(state, action) {
            state.uploaded.push(action.payload);
        },
        addCommentToImage(state, action) {
            const { imageId, commentInfo } = action.payload;
            const image = state.uploaded.find((img) => img.id === imageId);
            if (image) {
                if (!image.comments) {
                    image.comments = [];
                }
                image.comments.push(commentInfo);
            }
        },
        addCommentnf(state,action){
            const { imageId, commentInfo } = action.payload;
            const feed = state.newsfeed.find((img) => img.id === imageId);
            if(feed) {
                if (!feed.comments) {
                    feed.comments = [];
                }
                feed.comments.push(commentInfo);
            }
        },
        addToSaved(state, action) {
            const postId = action.payload.id;
            const alreadyExists = state.saved.find(item => item.id === postId)
            if (!alreadyExists) {
              state.saved.push(action.payload);
            }
          },

        removeSaved(state,action){
           state.saved = state.saved.filter((save)=>save.id !== action.payload)
        },
        deleteComment(state, action) {
            const { imageId, commentId } = action.payload;
            const image = state.uploaded.find((img) => img.id === imageId);
            if (image && image.comments) {
                image.comments = image.comments.filter((image) => image.commentId !== commentId);
            }
        },
        deleteCommentnf(state, action) {
            const { imageId, commentId } = action.payload;
            const post = state.newsfeed.find((post) => post.id === imageId);
            if (post) {
              post.comments = post.comments.filter((comment) => comment.commentId !== commentId);
            }
          },
        editComment(state, action) {
            const { imageId, commentId, newComment } = action.payload;
            const image = state.uploaded.find((img) => img.id === imageId);
            if (image) {
              const comment = image.comments.find((c) => c.commentId === commentId);
              if (comment) {
                comment.comment = newComment;
              }
            }
          },
        selectPhoto(state, action) {
            state.selected = action.payload;
        },
        selectPhotoComment(state, action) {
            state.selectedphotocomment = action.payload;
        },
        
        addPhotoComment(state,action){
        
        },
        removeSelected(state) {
            state.selected = null;
        },
        removePhoto(state, action) {
            state.uploaded = state.uploaded.filter((item) => item.id !== action.payload);
        },
        addFolder(state, action) {
            state.uploaded.push(action.payload);
        },
        changePhoto: (state, action) => {
            state.profilepic = { url: action.payload.url, name: action.payload.name };
          },
          changecoverPhoto: (state, action) => {
            state.coverpic = { url: action.payload.url, name: action.payload.name };
          },
        updatePhoto(state, action) {
            state.profilepic = action.payload;
        },
        updateCover(state,action){
            state.coverpic = action.payload;
        },
        updateStory(state,action){
            state.story = action.payload;
        }
    }
});

export const { addPhoto,addCommentnf,deleteCommentnf,updateStory,addToSaved,removeSaved,selectPhotoComment, addCommentToImage,deleteComment,editComment, selectPhoto,updateCover, removePhoto,changecoverPhoto, removeSelected, addFolder, changePhoto, updatePhoto } = photoslice.actions;
export default photoslice.reducer;
