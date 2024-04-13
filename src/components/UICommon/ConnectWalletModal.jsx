import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import Button from '../UICommon/Button'
import IConMetaMask from '@/assets/icon-metamask.svg';
import IConMagic from '@/assets/icon-magic-wallet.svg';
import IConCoinbase from '@/assets/icon-coinbase.svg';
import IconClose from '@/assets/icon-close-black.svg';
import IConWalletconnect from '@/assets/icon-wallet-connect.svg';

import styles from './ConnectWalletModal.module.scss';

export default function ConnectWalletModal({showModal, onConnectWallet, onCloseModal, onError}) {
  
  const wallets = useSelector((state) => state.account.wallets);
  let isMobile = false

  if (typeof window !== "undefined") {
    isMobile = (window.innerWidth < 640)
    if (isMobile) console.log("ConnectWalletModal: mobile mode on")
  }

  useEffect(() => {
    //if (wallets) console.log("ConnectWalletModal:  wallets updated: ", wallets)
  }, [wallets]);
  
  const handleClickOutside = (e) => {
    //console.log("resetting display of modal");
    onCloseModal()
  }

  const getWalletData = (which) => {
    if (wallets) {
      
      const exists = wallets.find((wallet) => wallet.wallet_name === which);
      return (exists? exists.address : null)
    }
    
  }

  const getError = (error) => {
      if (error.message) {
        if (typeof error.message === 'object') 
          return error.message.toString();
        else
          return error.message
      } else {
        console.log("issue? ")
      }
  }

  return (
    <>
    {(showModal) &&
    <div className={styles.modalmask} onClick={handleClickOutside}>
      <div className={styles.modalmaskOuter}>
        <div className={styles.modalmaskInner}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          {!isMobile?
            <div className={styles.content}>
              <h2>Link more digital addresses</h2>
              {onError && <p className={styles.errorAlerts}>{onError? getError(onError?.error) : '' }</p>}
              <ul>
                  <li onClick={(e) => onConnectWallet(e, 'metamask')}>
                    <div className={styles.buttonInner}><IConMetaMask /><span>MetaMask</span> 
                    {(onError && onError.id === 'metamask') ? 
                      <>
                        🔴 {'Error'}
                      </>
                     :
                    <span>{getWalletData('metamask')? " linked" : ""}</span>}
                    </div>
                  </li>
                  <li onClick={(e) => onConnectWallet(e, 'coinbase')}>
                    <div className={styles.buttonInner}><IConCoinbase /><span>Coinbase Wallet</span>
                    {(onError && onError.id === 'coinbase') ? 
                      <>
                        🔴 {'Error'}
                      </>
                     :
                     <span>{getWalletData('coinbase')? " linked" : ""}</span>}
                    </div>
                  </li>
                  <li onClick={(e) => onConnectWallet(e, 'magic')}>
                    <div className={styles.buttonInner}><IConMagic /><span>Magic</span> 
                    {(onError && onError.id === 'magic') ? 
                      <>
                        🔴 {'Error'}
                      </>
                     :
                     <span>{getWalletData('magic')? " linked" : ""}</span>}
                    </div>
                  </li>
                  <li onClick={(e) => onConnectWallet(e, 'walletconnect')}>
                    <div className={styles.buttonInner}><IConWalletconnect /><span>Wallet Connect</span> 
                    {(onError && onError.id === 'walletconnect') ? 
                      <>
                        🔴 {'Error'}
                      </>
                     :
                     <span>{getWalletData('walletconnect')? " linked" : ""}</span>}
                    </div>
                  </li>
              </ul>
              <p>Your mstylelab digital address is the default digital address linked to your account, and cannot currently be used to send or receive other digital assets.</p>
            </div>
            :
            <div className={styles.mobileContent}>
              <h2>Link more digital addresses</h2>
              {onError && <p className={styles.errorAlerts}>{onError? getError(onError?.error) : '' }</p>}
              <ul>
                  <li onClick={(e) => onConnectWallet(e, 'magic')}>
                    <div className={styles.buttonInner}><IConMagic /><span>Magic</span> 
                    {(onError && onError.id === 'magic') ? 
                      <>
                        🔴 {'Error'}
                      </>
                     :
                     <span>{getWalletData('magic')? " linked" : ""}</span>}
                    </div>
                  </li>
                  <li onClick={(e) => onConnectWallet(e, 'walletconnect')}>
                    <div className={styles.buttonInner}><IConWalletconnect /><span>Wallet Connect</span> 
                    {(onError && onError.id === 'walletconnect') ? 
                      <>
                        🔴 {'Error'}
                      </>
                     :
                     <span>{getWalletData('walletconnect')? " linked" : ""}</span>}
                    </div>
                  </li>
              </ul>

              <div>
                  <p>
                    if you want to connect to either Metamask or Coinbase without going through wallet connect, you will have to continue on the mobile wallet browser.<br />
                    <br />
                    1) Make sure the wallet app is launched and have the mobile wallet browser open<br />
                    2) Click on one of the 2 links below<br />
                    3) The links will take you to your chosen wallet with mstylelabs open, from there, log in and then follow instructions.<br />
                  </p>
                  <p><a href="https://metamask.app.link/dapp/184f-96-232-36-48.ngrok-free.app/social/mstylelab/profile/wallet?mode=mm">Click here to connect via metamask mobile app</a></p>
                  <p><a href="https://go.cb-w.com/dapp?cb_url=184f-96-232-36-48.ngrok-free.app/social/mstylelab/profile/wallet?mode=cb">Click here to connect via coinbase mobile app</a></p>
              </div>
            </div>}
            <Button className={styles.btnClose} onClick={onCloseModal}>
              <IconClose />
            </Button>
          </div>
          
        </div>
      </div>
    </div>
    }
    </>
  )
}