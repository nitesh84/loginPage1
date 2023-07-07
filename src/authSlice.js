// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;

export default authSlice.reducer;

