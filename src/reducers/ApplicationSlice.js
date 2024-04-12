import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isReturningUser: false,
  openModal: false,
  devMode: false
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateIsLoggedIn: (state, action) => {
      return {
          ...state,
          isLoggedIn: action.payload
      }
    },
    updateIsReturningUser: (state, action) => {
      return {
          ...state,
          isReturningUser: action.payload
      }
    },
    setOpenModal: (state, action) => {
      return {
          ...state,
          openModal: action.payload
      }
    },
    setDevMode: (state, action) => {
      return {
          ...state,
          devMode: action.payload
      }
    }
  }
});

export const {updateIsLoggedIn, updateIsReturningUser, setOpenModal, setDevMode}  = applicationSlice.actions;

export default applicationSlice.reducer;