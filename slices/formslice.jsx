import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  displayName: '',
  aboutYourself: '',
  birthday: new Date(),
  bloodGroup: '',
  gender: '',
  country: '',
  profession: '',
  phno: '',
  gmail:'',
  hobbies: '',
  education: '',
  workExperience: [{ work: '', experience: '' }],
  socialMediaLinks: {  facebook: '',instagram: '',twitter: '',youtube: ''},
  interests: [],
  profilePic: '',
  coverPic: '', 
  countryCode: '' 
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData(state, action) {
      return { ...state, ...action.payload };
    },
    resetFormData(state) {
      return initialState;
  },
  },
});

export const { setFormData,resetFormData } = formSlice.actions;
export default formSlice.reducer;
