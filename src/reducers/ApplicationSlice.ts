import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isLoggedIn: boolean,
  isReturningUser: boolean,
  openModal: boolean,
  devMode: boolean
}

const initialState: AppState = {
  isLoggedIn: false,
  isReturningUser: false,
  openModal: false,
  devMode: false
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      return {
          ...state,
          isLoggedIn: action.payload
      }
    },
    updateIsReturningUser: (state, action: PayloadAction<boolean>) => {
      return {
          ...state,
          isReturningUser: action.payload
      }
    },
    setOpenModal: (state, action: PayloadAction<boolean>) => {
      return {
          ...state,
          openModal: action.payload
      }
    },
    setDevMode: (state, action: PayloadAction<boolean>) => {
      return {
          ...state,
          devMode: action.payload
      }
    }
  }
});

export const { updateIsLoggedIn, updateIsReturningUser, setOpenModal, setDevMode } = applicationSlice.actions;

export default applicationSlice.reducer;