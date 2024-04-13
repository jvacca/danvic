import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import {copyToClipBoard, textEllipsisMid} from '../../utils/GlobalUtilities';
import Button from '../UICommon/Button'
import IConCopy from '../../assets/icon-copy.svg';
import styles from '../../pages/profile/profile.module.scss';

// eslint-disable-next-line react/display-name
export default function Account({walletType, accounts, status, provider}) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    //console.log("Accounts CHECKING----------------------- ", walletType, accounts, status, provider)
    if (provider && accounts?.length) {
      if (walletType === 'metamask' || walletType ==='coinbase') {
        Promise.all(accounts.map((account) => provider?.getBalance(account))).then((balances) => {
          const balance = ethers.utils.formatEther(balances[0]._hex)
          //console.log('balance ~~~~~~~~~~~~~~~~',  walletType, balance)
          setBalance(balance.slice(0,6))
        })
      } else if (walletType === 'macys' || walletType ==='magic'){
        //TODO: get balances for Magic and WalletConnect
        Promise.all(accounts.map((account) => provider?.getBalance(account))).then((balances) => {
          let balance = balances[0].toString().replace('/n', '/')     //remove the extra n in the response
          balance = ethers.utils.formatEther(balance)
          //console.log('balance~~~~~~~~~~~~~~~~', walletType, balance)
          setBalance(balance.slice(0,6))
        })
      } else if (walletType === 'walletconnect') {
        const walletProvider = new ethers.providers.Web3Provider(provider)
        Promise.all(accounts.map((account) => walletProvider.getBalance(account))).then((balances) => {
          const balance = ethers.utils.formatEther(balances[0]._hex)
          //console.log('balance~~~~~~~~~~~~~~~~',  walletType, balance)
          setBalance(balance.slice(0,6))
        })
      }
    }
  }, [provider, accounts]);

  const onCopy = (address) => {
    copyToClipBoard(address);
  }

  return (
    <div className={styles.accounts}>
      <ul>
        {status && accounts?.map((account, i) => (
          <li key={account}>
            <span>{textEllipsisMid(account)}</span>
            <Button onClick={() => onCopy(accounts[0])} className={styles.copyBtn}><IConCopy /></Button> {balance && <span>Balance: {balance} ETH</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}