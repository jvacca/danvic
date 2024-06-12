import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './reducers/AccountSlice'
import applicationReducer from './reducers/ApplicationSlice'

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    account: accountReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch