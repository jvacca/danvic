import React, { useEffect, useState, useContext } from "react";

import Switch from '../UICommon/Switch';
import ChainSelect from './ChainSelect'
import Accounts from './Accounts';
import Button from '../UICommon/Button'
import IConCopy from '@/assets/icon-copy.svg';
import IConMetaMask from '@/assets/icon-metamask.svg';
import IConMacys from '@/assets/icon-macys.svg';
import IConMagic from '@/assets/icon-magic-wallet.svg';
import IConCoinbase from '@/assets/icon-coinbase.svg';
import IConWalletconnect from '@/assets/icon-wallet-connect.svg';
import styles from './CardStyles.module.scss';

import {copyToClipBoard, textEllipsisMid} from '../../services/GlobalUtilities'
import { CHAINS } from '../WalletConnectors/chains'
import {OptionsContext} from './WalletManager'

export default function Card({
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
  disable
}) {

  const options = useContext(OptionsContext);
  
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

  const getChainName = (chainId) => {
    return chainId ? CHAINS[chainId]?.name : undefined
  }

  const onCopy = (address) => {
    copyToClipBoard(address);
  }

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
      /></div>}
     
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
    </>
  )
}
