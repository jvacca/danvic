import React, {useEffect, useState, useRef, useContext} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {Alchemy, Network} from "alchemy-sdk";
import { ethers } from "ethers";
import {textEllipsisMid} from '../../services/GlobalUtilities';
import { CHAINS } from '../WalletConnectors/chains'

import {WalletProvidersContext} from '../../pages/_app'
import IConMetaMask from '@/assets/icon-metamask.svg';
import IConMacys from '@/assets/icon-macys.svg';
import IConMagic from '@/assets/icon-magic-wallet.svg';
import IConCoinbase from '@/assets/icon-coinbase.svg';
import IConWalletconnect from '@/assets/icon-wallet-connect.svg';
import styles from './WalletScanner.module.scss';
import WalletManager from "../WalletComponents/WalletManager.jsx";
import Button from '../UICommon/Button'
import PDPThumb from "@/pages/mynfts/[contractid]/PDPThumb";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function WalletScanner() {
    const walletManager = useRef()
    const addressRef = useRef()
    const [currentProvider, setCurrentProvider] = useState(null)
    const [balance, setBalance] = useState(null)
    const [nfts, setNfts] = useState(null)
    const walletProviders = useContext(WalletProvidersContext)
    const [currentAccount, setCurrentAccount] = useState(null)
    const connectedWallets = useSelector((state) => state.account.wallets)
    const [selectedWallet, setSelectedWallet] = useState('macys')

    const keyswap = [
      'zAkXe4ui1WtGY0jkmTee1IrJ3zI1pewx',
      'K3bqMfa3xxKXjSyyX8Sr2Iy7n3OCNfPX',
      'eflQAy0s_v6rAI1q2CiKQZLf69-qN8z-',
      'vAMzsga-DEPYHrECGcrp0EdpgSh-YMcv',
      "ZfRh6v4NvnEdmXTWp0F8xl3Fzmnn1NEp"
    ]

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

    const getNetwork = (id) => {
      switch(id) {
        case 1:
          return Network.ETH_MAINNET
        case 5:
          return Network.ETH_GOERLI
        case 137:
          return Network.MATIC_MAINNET
        case 80001:
          return Network.MATIC_MUMBAI
        default:
            return ''
      }
    }

    async function getNFTs(address, network) {
      const config = {
          apiKey: keyswap[Math.floor(Math.random() * keyswap.length)],
          network: getNetwork(network)
      };
      console.log("Getting NFTs with ", address, network, config)
      try {
        const alchemy = new Alchemy(config);
        const nfts = await alchemy.nft.getNftsForOwner(address)
        return nfts
      } catch(error) {
        console.log("Error getting nfts ", error)
      }
    }

    useEffect(() => {
      // grab the current wallet's provider when it's available
      console.log("MyCollectionsDev checking: ", connectedWallets, selectedWallet)
      const walletObj = connectedWallets.find((wallet) => (wallet.wallet_name === selectedWallet))
      const providersUpdated = walletProviders.providers.find((p) => (p.id === selectedWallet))
      console.log("MyCollectionsDev: all wallet providers ~~~~ ", walletProviders.providers)
      console.log("MyCollectionsDev current wallet and provider: ~~~~~~~~~~~~~", walletObj, providersUpdated)

      if (walletObj && providersUpdated) {
          console.log("MyCollectionsDev: found selected wallet and provider: ", walletObj, providersUpdated)
          setCurrentProvider(providersUpdated.provider)
          setCurrentAccount(walletObj)

          getNFTs(walletObj.address, walletObj.network).then((data) => {
            console.log("GOT NFTS!!!! ", data)
            
            if (data?.ownedNfts?.length > 0) {
              const collection = []
              data.ownedNfts.map((nft) => {
                collection.push(nft)
              })
              console.log("counted NFTS!!!! ", collection.length)
              setNfts(collection)
            }
          })
      }

    }, [walletProviders.providers, selectedWallet])

    useEffect(() => {
      // get the balance for the current wallet only if the account and provider is available
      if (currentProvider && currentAccount) {
        console.log("MyCollectionsDev: ~~~Trying to get balance now that I got provider:~~~~ ", currentProvider, currentAccount.address)
        Promise.all([currentAccount.address].map((account) => currentProvider?.getBalance(account))).then((balances) => {
          const balance = ethers.utils.formatEther(balances[0]._hex)
          console.log('balance ~~~~~~~~~~~~~~~~',  currentAccount.wallet_name, balance)
          setBalance(balance.slice(0,6))
        })
      }
    }, [currentProvider, currentAccount])

    useEffect(() => {
      // grab the current wallet's provider when it's available
      console.log("MyCollectionsDev checking address: ", currentAccount)
      if (currentAccount && addressRef.current.value) {
        console.log("Making call???????????")
        getNFTs(currentAccount.address, currentAccount.network).then((data) => {
          console.log("GOT NFTS!!!! ", data)
          
          if (data?.ownedNfts?.length > 0) {
            const collection = []
            data.ownedNfts.map((nft) => {
              collection.push(nft)
            })
            console.log("counted NFTS!!!! ", collection.length)
            setNfts(collection)
          }
        })
      }
    }, [currentAccount])

    const onSelectWallet = (selectedWallet) => {
      setNfts(null)
      setBalance(null)
      setSelectedWallet(selectedWallet)
    }

    const onWalletAddress = () => {
      console.log("MyCollectionsDev checking ***: ", addressRef.current.value)
      setCurrentAccount({
        address: addressRef.current.value,
        network: '137'
      })
    }

    return (
      <>
      <div className={styles.walletScannerFrame}>
        {connectedWallets && 
        <div className={styles.currentWallet}>
          <p>Select a wallet:</p>
          <select
            className={styles.walletSelector}
            value={selectedWallet}
            onChange={((e) => {
              onSelectWallet(e.target.value)
            })}>
              <option hidden disabled>Select Chain</option>
              {connectedWallets.map((wallet) => (
                <option key={wallet.wallet_name} value={wallet.wallet_name}>{wallet.wallet_name}</option>
              ))}
          </select> <input ref={addressRef} type="text" placeholder="Or enter wallet address" /> <Button onclickHandler={onWalletAddress}>Add</Button>
        </div>}
        {(currentProvider && currentAccount) && 
        <div className={styles.currentWallet}>
            <div className={styles.walletName}>{getWalletIcon(currentAccount.wallet_name)} <p>{getWalletName(currentAccount.wallet_name)}</p></div>
            {currentAccount.isConnected ? (
              <div className={styles.walletStatus}>🟢</div>
            ) : (
              <div className={styles.walletStatus}>⚪️</div>)}
            <div className={styles.walletAddress}><h3>{textEllipsisMid(currentAccount.address)}</h3></div>
            <div className={styles.walletChain}><p>{CHAINS[currentAccount.network].name}</p></div>
            {balance && <div className={styles.walletBalance}><p>Balance: {balance} ETH</p></div>}
        </div>}
      </div>
      <div className={styles.collection}>
        <h3>Collections:</h3>
        {nfts &&<div className={styles.digitalItems}>
          <ul>
          {nfts && nfts.map(nft => <PDPThumb key={nft.title} nft={nft} network={currentAccount.network} />)}
          </ul>
        </div>}
      </div>
      <WalletManager ref={walletManager} show={false} />
      </>
    )
}