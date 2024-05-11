import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux';
import Button from '../UICommon/Button'
import Card from './Card'
import IConContextMenu from '@/assets/icon-contextmenu.svg';
import styles from './CardStyles.module.scss';
import {ethers} from 'ethers'

const { Magic } = require('magic-sdk');

let magicconnect = null;
if (typeof window !== "undefined") {

  const polygonMumbai = {
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/0e1b42741af54fa0b3ed7766b492ee83', // Polygon mumbai RPC URL
    chainId: 80001, // Polygon mumbai chain id
  }

  const polygonMainnet = {
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/0e1b42741af54fa0b3ed7766b492ee83', // Polygon mumbai RPC URL
    chainId: 1, // Polygon mumbai chain id
  }

  magicconnect = new Magic("pk_live_E12E097E5958B057", {
    network: polygonMainnet
  });
}

// eslint-disable-next-line react/display-name
const MagicConnectWalletCard = forwardRef(({account, show, onStatusChange, onError}, ref) => {
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const [chainId, setChainId] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [isActivating, setIsActivating] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [provider, setProvider] = useState()
  const prevIsActive = useRef(null);
  const [error, setError] = useState(undefined)
  const cardRef = useRef()

  const polygonMumbai = {
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/0e1b42741af54fa0b3ed7766b492ee83', // Polygon mumbai RPC URL
    chainId: 80001, // Polygon mumbai chain id
  }

  const polygonMainnet = {
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/0e1b42741af54fa0b3ed7766b492ee83', // Polygon mumbai RPC URL
    chainId: 1, // Polygon mumbai chain id
  }

  async function getNetwork(param_provider) {
    const { chainId } = await param_provider.getNetwork();
    //console.log("~~~~~~~~~~~~~~~~~~~~~~~ NETWORK? ", chainId)
    return chainId
  }

  useEffect(() => {
    if (localStorage.getItem('m3magic') === 'true' || !account) {
      setIsActivating(true)
      loginMagicConnect().then((acct) => {
        if (acct) {
          console.log("Got Magic account ", acct)
          const local_provider = new ethers.providers.Web3Provider(magicconnect.rpcProvider);
          setProvider(local_provider)
          //console.log("~~~~~~~~~~~~~~~~~~~~~~~ PROVIDER? ", local_provider)
          getNetwork(local_provider).then((chainid) => {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~got the NETWORK? ", chainid)
            setChainId(chainid)
            setAccounts(acct);
            setIsActive(true);
            setIsActivating(false);
          });
          localStorage.setItem('m3magic', true);          
        }
      })
    }
  }, []);

  useEffect(() => {
    if (prevIsActive.current !== isActive) {
      if (accounts) console.log("MagicConnectWalletCard: change in status ", isActive);
      
      onStatusChange('magic', isActive, {
        address: accounts? accounts[0] : '',
        network: chainId,
        wallet: 'magic'
      })

      if (isActive) setError(false)
    }

    if (error) {
      onError('magic', error)
    }
  }, [isActive, error])

  useEffect(() => {
    if (isActive && accounts && chainId) {
      if (accounts) console.log("MagicConnectWalletCard: change in account or chain ", accounts);

      onStatusChange('magic', null, {
        address: accounts? accounts[0] : '',
        network: chainId? chainId : '',
        wallet: 'magic',
        isConnected: true,
        provider: provider
      })
    }
  }, [accounts, chainId])

  useEffect(() => {
    prevIsActive.current = isActive;
  }, [isActive])  

  useImperativeHandle(ref, () => {
    return {
      connectWallet() {
        console.log("MagicConnectWalletCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
        onConnectDisconnect(e, 'magic', true)
      },
      closeContextMenu() {
        cardRef.current.closeFlyout()
      }
    }
  })

  async function loginMagicConnect() {
    console.log('MagicConnectWalletCard: Logging in');
    try {
      let accounts = (typeof magicconnect !== 'undefined')? await magicconnect.wallet.connectWithUI() : null;
      
      try {
        accounts.on('done', function (data) {
          console.log('MagicConnectWalletCard: wallet connect done!', data);
          
        })
  
        accounts.on('error', function (error) {
          setError(error)
        });
        console.log('MagicConnectWalletCard: Logged in user:', accounts[0], accounts);
      } catch(e){}
  
      return accounts;
    } catch(e) {
      console.log("Error connecting to magic ", e);
      setError({message: e})
    }
  }
  
  function logoutMagicConnect() {
    console.log('MagicConnectWalletCard: Logging out');
    const promise = magicconnect.wallet.disconnect().then(data => {
      console.log("MagicConnectWalletCard: magicconnect logged out");
      
    })
    .catch((e) => {
      console.log("Error logging out of magic ", e);
      setError({message: e})
    })
  
    return promise
  }

  const onConnectDisconnect = (e, id, isOn) => {
    if (isOn) {
      setIsActivating(true)
      loginMagicConnect().then((acct) => {
        if (acct) {
          console.log("Logged in and got Magic account ", acct)
          const local_provider = new ethers.providers.Web3Provider(magicconnect.rpcProvider);
          setProvider(local_provider)
          //console.log("~~~~~~~~~~~~~~~~~~~~~~~ PROVIDER? ", local_provider)
          getNetwork(local_provider).then((chainid) => {
            //console.log("~~~~~~~~~~~~~~~~~~~~~~~ NETWORK? ", chainid)
            setChainId(chainid)
            setAccounts(acct);
            setIsActive(true);
            setIsActivating(false);
          });          
          localStorage.setItem('m3magic', true);
        }
      })
    } else {
      logoutMagicConnect().then(data => {
        console.log("MagicConnectWalletCard: turning activation off");
        setAccounts('')
        setChainId('')
        setIsActive(false)
        setIsActivating(false);
        localStorage.setItem('m3magic', false)
      })
    }
  }

  const handleRemoveWallet = (walletAddress) => {
    logoutMagicConnect().then(data => {
      setAccounts('')
      setChainId('')
      setIsActive(false)
      setIsActivating(false)
      localStorage.setItem('m3magic', false)
    });
    //onRemoveWallet(walletAddress);
  }

  const getDefaultWallet = (address) => {
    return (address === defaultWallet.address)
  }

  const handleNetworkChange = (chainid) => {
    console.log("MagicConnectWalletCard: changing network for magic ", chainid)
    if (chainid === 80001) {
      magicconnect = new Magic("pk_live_E12E097E5958B057", {
        network: polygonMumbai
      });
    } else if (chainid === 137) {
      magicconnect = new Magic("pk_live_E12E097E5958B057", {
        network: polygonMainnet
      });
    }
    onConnectDisconnect(null, 'magic', true)
  }

  return (
    (show && account)? <li>
      <Card
        ref={cardRef}
        id={'magic'}
        connector={handleNetworkChange}
        activeChainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
        accounts={accounts}
        provider={provider}
        onConnectDisconnect={onConnectDisconnect}
        onRemoveWallet={handleRemoveWallet}
      />
    </li>
    :
    null
  )
})

export default MagicConnectWalletCard;