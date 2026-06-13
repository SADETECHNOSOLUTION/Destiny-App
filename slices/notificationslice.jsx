import {createSlice} from '@reduxjs/toolkit'
import data from '../notification.json'

const initialState = {
    notifications:data.notification
}
const notificationslice = createSlice({
    name:'notification',
    initialState,
    reducers:{
        removeNotification(state,action){
            state.notifications = state.notifications.filter(item=>item.id!==action.payload);
        },
    }
})

export const {removeNotification} = notificationslice.actions;
export default notificationslice.reducer;
