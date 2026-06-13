
import {createSlice} from '@reduxjs/toolkit'
import data from '../message.json'

const initialState = {
    messages:data
}
const messageslice = createSlice({
    name:'message',
    initialState,
    reducers:{
        removeMessage(state,action){
            state.messages = state.messages.filter(item=>item.id!==action.payload);
        },
    }
})

export const {removeMessage} = messageslice.actions;
export default messageslice.reducer;
