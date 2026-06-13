import {createSlice} from '@reduxjs/toolkit'
import data from '../friendrequest.json'

const initialState = {
    friendrequests:data
}
const friendrequestslice = createSlice({
    name:'friendrequest',
    initialState,
    reducers:{
        removeRequest(state,action){
            state.friendrequests = state.friendrequests.filter(item=>item.id!==action.payload);
        },
    }
})

export const {removeRequest} = friendrequestslice.actions;
export default friendrequestslice.reducer;
