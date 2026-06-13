import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postliked:{},
  videoliked:{},
  postlikeCount:{},
  videolikeCount:{}
};

const likeslice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    setpostLike(state, action) {
      const { id, liked } = action.payload;
      state.postliked[id] = liked;

      if (liked) {
        state.postlikeCount[id] = (state.postlikeCount[id] || 0) + 1;
      } else {
        state.postlikeCount[id] = Math.max((state.postlikeCount[id] || 0) - 1, 0);
      }
    },
    setLike(state, action) {
      const { postId, commentId } = action.payload;
      if (commentId) {
        // If commentId exists, update like count for comments
        if (!state.likeCounts[postId]) {
          state.likeCounts[postId] = {};
        }
        state.likeCounts[postId][commentId] = (state.likeCounts[postId][commentId] || 0) + 1;
      } else {
        // Update like count for posts
        state.likeCounts[postId] = (state.likeCounts[postId] || 0) + 1;
      }
    },
        setvideoLike(state, action) {
      const { id, liked } = action.payload;
      state.videoliked[id] = liked;

      if (liked) {
        state.videolikeCount[id] = (state.videolikeCount[id] || 0) + 1;
      } else {
        state.videolikeCount[id] = Math.max((state.videolikeCount[id] || 0) - 1, 0);
      }
    },
    unsetLike(state, action) {
      const { postId, commentId } = action.payload;
      if (commentId) {
        // If commentId exists, decrement like count for comments
        if (state.likeCounts[postId] && state.likeCounts[postId][commentId]) {
          state.likeCounts[postId][commentId] = Math.max(0, (state.likeCounts[postId][commentId] || 0) - 1);
        }
      } else {
        // Decrement like count for posts
        if (state.likeCounts[postId]) {
          state.likeCounts[postId] = Math.max(0, (state.likeCounts[postId] || 0) - 1);
        }
      }
    },
  },
});

export const { setpostLike,setLike,unsetLike,setvideoLike } = likeslice.actions;
export default likeslice.reducer;
