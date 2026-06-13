
import {createSlice} from '@reduxjs/toolkit'
import data from '../message.json'

const initialState = {
    role:""
}
const roleformslice = createSlice({
    name:'role',
    initialState,
    reducers:{
        addRole(state, action) {
            state.role = action.payload;
          },
        removeRole(state,action){
            state.role = ''
        },
    }
})

export const {addRole,removeRole} = roleformslice.actions;
export default roleformslice.reducer;
