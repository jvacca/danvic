import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  profileName: null,
  defaultWallet: 'macys',
  wallets: [],
  currentAccount: {
    address: null,
    network: null,
    balance: null,
    wallet: null
  }
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateUserId: (state, action) => {
      return {
        ...state,
        userId: action.payload
      }
    },
    updateProfileName: (state, action) => {
      return {
          ...state,
          profileName: action.payload
      }
    },
    updateAccount: (state, action) => {
      return {
        ...state,
        currentAccount: {
          ...action.payload
        }
      }
    },
    updateDefaultWallet: (state, action) => {
      return {
        ...state,
        defaultWallet: action.payload
      }
    },
    updateWallets: (state, action) => {
      return {
        ...state,
        wallets: action.payload
      }
    },
    addWallet: (state, action) => {
      return {
        ...state,
        wallets: [...state.wallets, action.payload]
      }
    },
    removeWallet: (state, action) => {
      return {
        ...state,
        wallets: state.wallets.filter(wallet => (wallet.address !== action.payload))
      }
    },
    updateWalletStatus: (state, action) => {
      const updatedWallets = state.wallets.map(item => {
        if (item.wallet_name === action.payload.which) {
          return {
            ...item,
            isConnected: action.payload.value
          } 
        } else {
          return item
        }
      })
      return {
          ...state,
          wallets: updatedWallets
      }
    },
    updateWalletData: (state, action) => {
      const updatedWallets = state.wallets.map(item => {
        if (item.wallet_name === action.payload.which) {
          return action.payload.value
        } else {
          return item
        }
      })
      return {
          ...state,
          wallets: updatedWallets
      }
    }
  }
});

export const {
  updateAccount, 
  updateProfileName, 
  updateUserId,
  updateDefaultWallet,
  updateWallets,
  updateWalletStatus,
  addWallet,
  removeWallet,
  updateWalletData
} = accountSlice.actions;

export default accountSlice.reducer;