import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle, useContext } from "react";

import Switch from '../UICommon/Switch';
import FlyoutMenu from '../UICommon/FlyoutMenu'
import ChainSelect from './ChainSelect'
import Accounts from './Accounts';
import Button from '../UICommon/Button'
import IConCopy from '@/assets/icon-copy.svg';
import IConMetaMask from '@/assets/icon-metamask.svg';
import IConMacys from '@/assets/icon-macys.svg';
import IConMagic from '@/assets/icon-magic-wallet.svg';
import IConCoinbase from '@/assets/icon-coinbase.svg';
import IConWalletconnect from '@/assets/icon-wallet-connect.svg';
import IConContextMenu from '@/assets/icon-contextmenu.svg';
import IConHeart from '@/assets/icon-heart.svg';
import IConTrash from '@/assets/icon-trash.svg';
import IConLinkout from '@/assets/icon-linkout.svg';
import IConSwitchOn from '../../assets/icon-switch-on.svg';
import IConSwitchOff from '../../assets/icon-switch-off.svg';

import styles from './CardStyles.module.scss';
import useWalletStateSync from '../../hooks/useWalletStateSync'
import {copyToClipBoard, textEllipsisMid} from '../../services/GlobalUtilities'
import { CHAINS } from '../WalletConnectors/chains'
import {OptionsContext} from './WalletManager'

// eslint-disable-next-line react/display-name
const Card = forwardRef(({
  id,
  connector,
  activeChainId,
  isActivating,
  isActive,
  error,
  setError,
  accounts,
  provider,
  onConnectDisconnect,
  disable,
  onRemoveWallet
}, ref) => {

  const options = useContext(OptionsContext);
  const flyoutMenu = useRef();
  const {handleRemoveWallet, setDefaultWallet} = useWalletStateSync()

  const getWalletIcon = (name) => {
    switch(name) {
      case 'macys':
        return <IConMacys />
      case 'metamask':
        return <IConMetaMask />
      case 'coinbase':
        return <IConCoinbase />
      case 'magic':
        return <IConMagic />
        case 'walletconnect':
          return <IConWalletconnect />
      default:
          return ''
    }
  }

  const getWalletName = (name) => {
    switch(name) {
      case 'macys':
        return "mstylelab"
      case 'metamask':
        return "MetaMask"
      case 'coinbase':
        return "Coinbase"
      case 'magic':
        return "Magic"
      case 'walletconnect':
        return "Wallet Connect"
      default:
          return ''
    }
  }

  useImperativeHandle(ref, () => {
    return {
      closeFlyout() {
        flyoutMenu.current.closeMenu()
      }
    }
  })

  const getChainName = (chainId) => {
    return chainId ? CHAINS[chainId]?.name : undefined
  }

  const onCopy = (address) => {
    copyToClipBoard(address);
  }

  const handleClickOutside = (e) => {
    console.log("resetting display of context menu");
    flyoutMenu.current.closeMenu()
  }

  const onLinkout = (e) => {
    flyoutMenu.current.closeMenu()
  }

  const removeWallet = (accounts) => {
    handleRemoveWallet(accounts[0])
    onRemoveWallet(accounts[0])
    flyoutMenu.current.closeMenu()
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])

  return (
    <>
      {getWalletIcon(id)}
      <div className={styles.row}>
        {getWalletName(id)}<br />
        {(accounts && options.showBalances)?
        <Accounts walletType={id} accounts={accounts} provider={provider} status={isActive} />
        :
        accounts && <>
          <span>{textEllipsisMid(accounts[0])}</span>
          <Button onClick={() => onCopy(accounts[0])} className={styles.copyBtn}><IConCopy /></Button>
        </>
        }
      </div>
      
      {options.showSwitch && <div className={styles.connectionSwitch}><Switch
        id = {id}
        isActive = {isActive}
        toggleSwitchHandler = {onConnectDisconnect}
        disable = {disable? disable : false}
      >
        <IConSwitchOn />
        <IConSwitchOff />
      </Switch>
      
      </div>}
     
      {(options.showChains) && <p className={styles.default}>{getChainName(activeChainId)}</p>}
      {options.useChainSelect && <p className={styles.default}>
        <ChainSelect walletType={id} activeChainId={activeChainId} connector={connector} />
      </p>}
      {options.showStatus && <p className={styles.status}>
        {error ? (
          <>
            🔴 {'Error'}
          </>
        ) : isActivating ? (
          <>🟡 Connecting</>
        ) : isActive ? (
          <>🟢 Connected</>
        ) : (
          <>⚪️ Disconnected</>
        )}
      </p>}
      {error && <p className={styles.error}>{error.message ? `Error : ${error.message}` : ''}</p>}

      <FlyoutMenu ref={flyoutMenu}>
        <FlyoutMenu.Toggle id={id}>
          <IConContextMenu />
        </FlyoutMenu.Toggle>
        <FlyoutMenu.List>
          <ul>
            <li><IConHeart /><a onClick={() => setDefaultWallet(accounts)}>Set default wallet</a></li>
            <li><IConLinkout /><a href={`https://etherscan.io/address/${accounts}`} target="_blank" onClick={(e) => onLinkout()}>View on explorer</a></li>
            <li><IConTrash /><a onClick={() => removeWallet(accounts)}>Remove from list</a></li>
          </ul>
        </FlyoutMenu.List>
      </FlyoutMenu>
    </>
  )
})

export default Card