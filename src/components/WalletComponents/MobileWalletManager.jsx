import React, { useEffect, useState, useRef } from "react";

import CoinbaseWalletCard from "../WalletComponents/CoinbaseWalletCard";
import MetaMaskCard from "../WalletComponents/MetaMaskCard";

import styles from '../WalletComponents/CardStyles.module.scss';

export default function MobileWalletManager({mode, handleWalletStatusChange, handleRemoveWallet, setDefaultWallet, handleErrors, onContextMenuOpen}) {
  const [show, setShow] = useState(true)
  const [account, setAccount] = useState(false)
  
  const metaMaskCard = useRef();
  const coinbaseCard = useRef();

  const handleMobileWalletStatusChange = (which, status, walletData) => {
    if (status === true) {
      setAccount(walletData.address)
      handleWalletStatusChange(which, status, walletData)
    }
    
    //
  }

  return (
    <div className={styles.mobileMode}>
      <ul>
        {mode === 'mm'?<MetaMaskCard 
          ref={metaMaskCard} 
          show={show}
          account={account} 
          onStatusChange={handleMobileWalletStatusChange} 
          onRemoveWallet={handleRemoveWallet} 
          onSetDefaultWallet={setDefaultWallet}
          onError={handleErrors}
          onContextMenuOpen = {onContextMenuOpen}
        />
        :
        <CoinbaseWalletCard 
          ref={coinbaseCard} 
          show={show}
          account={account} 
          onStatusChange={handleWalletStatusChange} 
          onRemoveWallet={handleRemoveWallet} 
          onSetDefaultWallet={setDefaultWallet}
          onError={handleErrors}
          onContextMenuOpen = {onContextMenuOpen}
        />}
      </ul>
    </div>
  )
}