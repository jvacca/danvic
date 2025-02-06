import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentAccount {
  address: string | null,
  network: string | null,
  balance: string | null,
  wallet: string | null
}


export interface AccountState {
  userId: string | null,
  profileName: string | null,
  profileData: any,
  defaultWallet: string,
  wallets: Array<any>,
  currentAccount: CurrentAccount | null
}

const initialState: AccountState = {
  userId: null,
  profileName: null,
  profileData: null,
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
    updateUserId: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        userId: action.payload
      }
    },
    updateProfileName: (state, action: PayloadAction<string>) => {
      return {
          ...state,
          profileName: action.payload
      }
    },
    updateAccount: (state, action: PayloadAction<CurrentAccount>) => {
      return {
        ...state,
        currentAccount: {
          ...action.payload
        }
      }
    },
    updateProfileData: (state, action) => {
      return {
          ...state,
          profileData: action.payload
      }
    },
    updateDefaultWallet: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        defaultWallet: action.payload
      }
    },
    updateWallets: (state, action: PayloadAction<Array<any>>) => {
      return {
        ...state,
        wallets: action.payload
      }
    },
    addWallet: (state, action: PayloadAction<Array<any>>) => {
      return {
        ...state,
        wallets: [...state.wallets, action.payload]
      }
    },
    removeWallet: (state, action: PayloadAction<Array<any>>) => {
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
  updateProfileData,
  updateUserId,
  updateDefaultWallet,
  updateWallets,
  updateWalletStatus,
  addWallet,
  removeWallet,
  updateWalletData
} = accountSlice.actions;

export default accountSlice.reducer;