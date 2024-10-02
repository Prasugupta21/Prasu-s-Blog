
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currUser: null,
  error: null,

  loading:false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading=true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currUser = action.payload;
 state.loading=false;
      state.error = null;
    },
    signInFailure: (state, action) => {
     state.loading=false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading=true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currUser = action.payload;
      state.loading=false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
      state.loading=false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currUser = null;
      state.error = null;
   
    },
    resetPasswordStart: (state) => {
   
      state.error = null;
   
      state.loading=true
    },

    resetPasswordSuccess: (state) => {
    
      state.error = null;
   
      state.loading=false;
    },
   
  
  resetPasswordFailure: (state,action) => {
    
    state.error = action.payload;
 
    state.loading=false;
  },
  
},
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure
} = userSlice.actions;

export default userSlice.reducer;