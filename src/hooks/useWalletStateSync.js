/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {WalletProvidersContext} from '../pages/_app'
import {updateAccount, updateWallets, updateWalletStatus, updateWalletData, addWallet, removeWallet, updateProfileData} from '../reducers/AccountSlice';
import { coinbaseWallet } from '../components/WalletConnectors/coinbaseWallet'
import { metaMask } from '../components/WalletConnectors/metaMask'
import useAsyncLoad from "../hooks/useAsyncLoad";

/*
This hook is used to separate concerns and encapsulate all wallet related logic that has to do
with global state maintainance and CRUD database operations. Also, it was designed to be reused
in any wallet management related components should the need arise.
*/

export default function useWalletStateSync() {
  const currentAccount = useSelector((state) => state.account.currentAccount);
  const wallets = useSelector((state) => state.account.wallets);
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const walletProviders = useContext(WalletProvidersContext)
  const dispatch = useDispatch();
  const saveWalletData = useAsyncLoad();// add listeners for events from metamask or coinbase

  const addWalletToDb = ((updateWalletObj) => {
    const wallet = {
      userid: sessionStorage.getItem('m3ids'),
      address: updateWalletObj.address,
      chain: updateWalletObj.network,
      wallet_name: updateWalletObj.wallet_name
    }
    console.log("useWalletStateSync: saving **** ", wallet)
    saveWalletData('/users/setuserwallets', wallet).then((res) => {
      console.log("useWalletStateSync: wallet updated: ", res);
      
      if (res) {
        updateWalletObj.isConnected = true;
        //dispatch(addWallet(updateWalletObj));
        dispatch(updateWalletStatus({which: updateWalletObj.wallet_name, value:true}));
        localStorage.setItem('m3get', true)
        localStorage.removeItem('m3NL')

        //also add updated wallet array to session storage as well
        if (sessionStorage.getItem('m3mwallets')) {
          try {
              let item = JSON.parse(sessionStorage.getItem('m3mwallets'));
              let wlt = Object.assign(item, {"wallets": res});
              //console.log('wlt',wlt);
              sessionStorage.setItem('m3mwallets', JSON.stringify(wlt));
          } catch(e){

          }
        } else {
            let wlt = {"wallets": res};
            //console.log('wlt',wlt);
            sessionStorage.setItem('m3mwallets', JSON.stringify(wlt));
        }

        console.log("useWalletStateSync: updating currentAccount ", updateWalletObj)
        dispatch(updateAccount(updateWalletObj)) 
      } 
    })
  });

  const handleRemoveWallet = (address) => {
    console.log("useWalletStateSync: removing from db ", address);

    const wallet = wallets.find(wallet => wallet.address === address);

    if (wallet) {
      const updateObj = {
        address: wallet.address,
        name: wallet.wallet_name
      }

      updateObj.userid = sessionStorage.getItem('m3ids');
      saveWalletData('/users/removeuserwallet', updateObj).then((res) => {
        console.log("useWalletStateSync: removed: ", res);
        
        if (res.wallets) {
          dispatch(removeWallet(updateObj.address));
          localStorage.setItem('m3get', true);
          localStorage.removeItem('m3NL');

          if (currentAccount?.wallet_name === updateObj.name) {
            dispatch(updateAccount(defaultWallet)) 
          }
        }
      })
    }
  }

  const setDefaultWallet = (address) => {
    const wallet = wallets.find((wallet) => {
      return (wallet.address === address)
    })
    
    const updateObj = {
      default_wallet: {
        address: wallet.address,
        network: wallet.network,
        wallet_name: wallet.wallet_name
      }
    }
    
    updateObj.userid = sessionStorage.getItem('m3ids');
    
    saveWalletData('/users/setusersettings', updateObj).then((res) => {
      console.log("Profile: Saved: ", res);
      dispatch(updateProfileData(res))
    })

    console.log("ProfileWallets: Setting this wallet as default ", updateObj);
  }

  const setCurrentWallet = (id) => {
    const newWallet = wallets.find((wallet) => wallet.wallet_name === id)

    if (newWallet) dispatch(updateAccount(newWallet))
  }

  const loadWalletDataToStates = (wallets) => {
    console.log("useWalletStateSync: resetting isConnected to false first time around");
    try {
      wallets.map(wallet => wallet.isConnected = false);
      dispatch(updateWallets(wallets));
    } catch(e){
      console.log('useWalletStateSync: there was an error in loadWalletDataToStates', wallets)
    }
  }
  
  const handleWalletStatusChange = (which, status, walletData) => {    
    if (status !== null) {
      if (walletData.address !== '') console.log("useWalletStateSync: wallet status change ", which, status, walletData);
      if (status === true && walletData.address !== '') { 
        const newWallet = wallets.find((wallet) => {
          let noConnected = true
          // look for isConnected property in the array
          for (let prop in wallet) {
            if (prop === 'isConnected') noConnected = false
          }

          // if there is no isConnected property it means it's not in the db yet
          return noConnected
        })

        if (newWallet) {
          console.log("useWalletStateSync: detected a new wallet to save and wallet data exists")
          let updateWalletObj = {
            address: walletData.address,
            network: walletData.network,
            wallet_name: walletData.wallet,
            isConnected: true
          }
          addWalletToDb(updateWalletObj)
        } else {
          console.log("useWalletStateSync: wallet status updating only")
          dispatch(updateWalletStatus({which: which, value:true}));
        }
      }
  
      if (status === false && walletData.address !== '') {
        console.log("useWalletStateSync: updating wallet status as disconnected ", which);
        dispatch(updateWalletStatus({which: which, value:false}));

        // if the current wallet is disconnected, switch current wallet back to default wallet for now
        if (currentAccount?.wallet_name === which) {
          dispatch(updateAccount(defaultWallet)) 
        }
      }

    } else {
      if (!walletData.address || !walletData.network) return

      console.log("useWalletStateSync: wallet data change ", which, walletData);
      let updateWalletObj = {
        address: walletData.address,
        network: walletData.network,
        wallet_name: walletData.wallet,
        isConnected: walletData.isConnected
      }
      
      // TODO: save data changes to DB. 
      // Will need to add a route for DB request to update wallet data in mmproxy
      /*
      const wallet = {
        userid: sessionStorage.getItem('m3ids'),
        address: updateWalletObj.address,
        chain: updateWalletObj.network,
        wallet_name: updateWalletObj.wallet_name
      }
      console.log("useWalletStateSync: updating **** ", wallet)
      saveWalletData('/users/updateuserwallets', wallet).then((res) => {
        console.log("useWalletStateSync: wallet updated: ", res);
        
        if (res) {
          wallet.isConnected = true;
          dispatch(updateWalletData({which: id, value: updateWalletObj}));
          localStorage.setItem('m3get', true);

          //also add updated wallet array to session storage as well
          if (sessionStorage.getItem('m3mwallets')) {
            try {
                let item = JSON.parse(sessionStorage.getItem('m3mwallets'));
                let wlt = Object.assign(item, {"wallets": res});
                //console.log('wlt',wlt);
                sessionStorage.setItem('m3mwallets', JSON.stringify(wlt));
            } catch(e){

            }
          } else {
              let wlt = {"wallets": res};
              //console.log('wlt',wlt);
              sessionStorage.setItem('m3mwallets', JSON.stringify(wlt));
          }
        } 
      })*/

      dispatch(updateWalletData({which: which, value: updateWalletObj}));
      walletProviders.addProvider({ id: walletData.wallet, provider: walletData.provider})

    }
  }
  /*
  const syncWalletConnected = async (which, walletData) => {
    console.log("useWalletStateSync: syncWalletConnected called!", which);
    const existingWallet = wallets.find(wallet => (wallet.wallet_name === which))
    
    //if (existingWallet && existingWallet.isConnected === true) return;
    
    let updateWalletObj = {
      address: walletData.address,
      network: walletData.network,
      wallet_name: walletData.wallet
    }
          
    if (existingWallet) {
      console.log("useWalletStateSync: wallet status updating only")
      dispatch(updateWalletStatus({which: updateWalletObj.wallet_name, value:true}));
      console.log("useWalletStateSync: updating currentAccount ", updateWalletObj)
      dispatch(updateAccount(updateWalletObj)) 
    } else {
      if (updateWalletObj) {
        console.log("useWalletStateSync: detected a new wallet to save and wallet data exists")
        addWalletToDb(updateWalletObj);
      }
    }
  }

  const syncWalletDisconnected = async (which) => {
    //console.log("useWalletStateSync: syncWalletDisconnected called", which);
    
    dispatch(updateWalletStatus({which: which, value:false}));

    // if the current wallet is disconnected, switch current wallet back to default wallet for now
    if (currentAccount?.wallet_name === which) {
      dispatch(updateAccount(defaultWallet)) 
    }
  }
*/
  const getCurrentWalletProvider = (id) =>  {
    const wallet = walletProviders.providers.find((provider) => provider.id === id)
    if (wallet) {
      console.log("useWalletStateSync: Found provider ", wallet.id, wallet.provider)
      return wallet.provider
    } else {
      return false
    }
    
  }

  return {handleWalletStatusChange, loadWalletDataToStates, handleRemoveWallet, setDefaultWallet, getCurrentWalletProvider, setCurrentWallet};
}