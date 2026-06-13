import { createSlice } from "@reduxjs/toolkit";
import data from '../followers.json'

const initialState = {
    followers:data
}
const followerslice = createSlice({
    name:'follower',
    initialState,
    reducers:{
        convertFollower(state,action){
        state.followers = state.followers.filter((follower)=>follower.id !== action.payload)
        }
    }
})

export const {convertFollower} = followerslice.actions
export default followerslice.reducer