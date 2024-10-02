
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currPost: null,
  error: null,

  loading:false
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    loadingPost: (state) => {
      state.loading=true;
      state.error = null;
    },
    viewPost: (state, action) => {
      state.currPost = action.payload;
 state.loading=false;
      state.error = null;
    },
    viewpostFailure: (state, action) => {
     state.loading=false;
      state.error = action.payload;
    },
  
  
},
});

export const {
    viewPost,
    loadingPost,
    viewpostFailure
} = postSlice.actions;

export default postSlice.reducer;