import { createSlice } from '@reduxjs/toolkit'
import data from '../friendlist.json'

const initialState = {
    Friends:data
}

const friendrequestSlice = createSlice({
    name:'friend',
    initialState,
    reducers:{
        addFriend(state, action) {
            const newFriend = action.payload;
            return {
              ...state,
              Friends: [...state.Friends, newFriend],
            };
          },
        removeFriend(state,action){
          state.Friends = state.Friends.filter((friend)=>friend.id !== action.payload)
        }
          
    }
})

export const {addFriend,removeFriend} = friendrequestSlice.actions;
export default friendrequestSlice.reducer