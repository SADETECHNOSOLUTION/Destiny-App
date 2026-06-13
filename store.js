import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slices/notificationslice'
import friendrequestReducer from './slices/friendrequestslice';
import messageReducer from './slices/messageslice'
import friendReducer from './slices/friendlistslice'
import photoReducer from './slices/photoslice'
import videoReducer from './slices/videoslice'
import likeReducer from './slices/likeslice'
import commentReducer from './slices/commentslice'
import followerReducer from './slices/followerslice'
import postReducer from './slices/postslice';
import storyReducer from './slices/storyslice'
import followingReducer from './slices/followingslice'
import formReducer from './slices/formslice'
import authReducer from './slices/authslice';
import roleformReducer from './slices/roleformslice'


const Store = configureStore({
    reducer:{
        notification:notificationReducer,
        friendrequest:friendrequestReducer,
        message:messageReducer,
        friend:friendReducer,
        photo:photoReducer,
        video:videoReducer,
        like:likeReducer,
        comment:commentReducer,
        follower:followerReducer,
        post:postReducer,
        story:storyReducer,
        following:followingReducer,
        form:formReducer,
        auth:authReducer,
        roleform:roleformReducer
    }
})

export default Store;
