import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { useSelector } from 'react-redux';

import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalState, useWeb3ModalAccount, useWeb3ModalProvider, useWeb3ModalError, useDisconnect, useWeb3ModalTheme } from '@web3modal/ethers5/react'
import {ethers} from 'ethers'
import Button from '../UICommon/Button'
import ContextMenu from '../UICommon/ContextMenu';
import IConContextMenu from '@/assets/icon-contextmenu.svg';
import Card from './Card'
import parse from 'html-react-parser';
import styles from './CardStyles.module.scss';

const projectId = "42bfb1d896d6d82ef8f4bea0b0d63e1d";

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
	name: "mystylelab",
	description: "mystylelab",
	url: "https://www.macys.com/social/mstylelab",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

createWeb3Modal({ 
	ethersConfig: defaultConfig({ metadata }), 
	chains: [mainnet],
	projectId,
	enableAnalytics: false,
  allWallets: 'HIDE'
});

// eslint-disable-next-line react/display-name
const WalletConnectCard = forwardRef(({account, show, onStatusChange, onRemoveWallet, onSetDefaultWallet, onError, onContextMenuOpen}, ref) => {
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const { setThemeMode } = useWeb3ModalTheme()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { open, close } = useWeb3Modal()
  const [isActivating, setIsActivating] = useState(false)
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider()
  const prevAddressClicked = useRef(null);
  const prevIsActive = useRef(null);
  const [error, setError] = useState(undefined)
  //const { error } = useWeb3ModalError()
  const [addressClicked, setAddressClicked] = useState(null);

  let isMobile = false

  if (window) {
    isMobile = (window.innerWidth < 640)
    if (isMobile) console.log("WalletConnectCard: mobile mode on")
  }

  useEffect(() => {
    

    if (!account) {
      console.log("WalletConnectCard: Found no account, try to connect ", account)
      setThemeMode('light')
      open()
      setIsActivating(true)
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, []);

  
  useEffect(() => {
    if (prevIsActive.current !== isConnected) {
      if (account) console.log("WalletConnectCard: change in status walletConnect", isConnected);

      onStatusChange('walletconnect', isConnected, {
        address: address? address : '',
        network: chainId? chainId : '',
        wallet: 'walletconnect'
      })

      if (isConnected) {
        setError(false)
        setIsActivating(false)
      }
    }

    if (error) {
      onError('walletconnect', error)
    }
  }, [isConnected, error])


  useEffect(() => {
    if (isConnected && address && chainId) {
      
      let provider = null
      if (walletProvider) {
        provider = new ethers.providers.Web3Provider(walletProvider)
      }
      if (address) console.log("WalletConnectCard: change in account or chain ", address, chainId, provider);
      onStatusChange('walletconnect', null, {
        address: address? address : '',
        network: chainId? chainId : '',
        wallet: 'walletconnect',
        isConnected: true,
        provider: provider? provider : ''
      })
    }

  }, [address, chainId, walletProvider])

  useEffect(() => {
    //if (addressClicked) console.log('just checking ------------------_____>', addressClicked)
    prevAddressClicked.current = addressClicked;
    prevIsActive.current = isConnected;
  }, [addressClicked, isConnected])  

  const getErrorMsg = (error) => {
    console.log("Getting error message: ", error.name)
    switch(error.name) {
      case 'NoMetaMaskError':
        error.message = parse("MetaMask extension not detected, <a target='blank' href='https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?pli=1'>Get MetaMask</a>")
        return (error)
        break;
      default:
        return (error)
    }
  }

  useImperativeHandle(ref, () => {
    return {
      connectWallet() {
        console.log("WalletConnectCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
        onConnectDisconnect(e, 'walletconnect', true)
      },
      closeContextMenu() {
        setAddressClicked(null);
      }
    }
  })

  const onConnectDisconnect = async (e, id, isOn) => {
    if (isOn) {
      try {
        console.log("WalletConnectCard: Connecting......")
        open()
        setIsActivating(true)
      } catch(error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
        setError(error)
      }
    } else {
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ disconnecting WalletConnect")
      if (isMobile) {
        try {
          disconnect()
        } catch(error) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
          //setError(getErrorMsg(error))
        }
      } else {
        setError({name:'not allowed', message:'Must disconnect from within the extension'})
      }
    }
  }

  const handleNetworkChange = (chainId) => {
    if (walletProvider) {
      const library = new ethers.providers.Web3Provider(walletProvider)
      console.log("WalletConnectCard: handleNetworkChange: ", library)
      library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }]
      })
      .then(() => {
        console.log("Connected to chain ", chainId)
      })
      .catch((error) => {
        console.log("error? ", error);
      })
    }
  }

  const handleClickOutside = (e) => {
    //console.log("resetting display of context menu");
    setAddressClicked(null);
  }

  const onToggleContextMenu = (e, address) => {
    e.stopPropagation();
    if (!prevAddressClicked.current) {
      setAddressClicked(address);
      onContextMenuOpen('walletconnect')
    } else {
      setAddressClicked(null);
    }
  }

  const handleRemoveWallet = (walletAddress) => {
    // remving reset because this does nothing to Metmask extension
    if (isConnected && isMobile) {
      try {
        disconnect()
        onRemoveWallet(walletAddress);
      } catch(error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
        //setError(getErrorMsg(error))
      }
    } else if (!isConnected && isMobile) {
      onRemoveWallet(walletAddress);
    }
      
    if (!isMobile) {
      if (!isConnected) {
        onRemoveWallet(walletAddress);
      } else {
        setError({name:'not allowed', message:'Must disconnect from within the extension'})
      }
    }
  }

  const onHideContextMenu = (e, address) => {
    setAddressClicked(null);
  }

  const getDefaultWallet = (address) => {
    return (address === defaultWallet.address)
  }

  return (
    (show && account)? <li>
        <div className={styles.contextMenuContainer2}>
          <ContextMenu
            walletAddress={addressClicked}
            onRemoveWallet={handleRemoveWallet} 
            onSetDefaultWallet={onSetDefaultWallet}
            onHideContextMenu={onHideContextMenu}
            onAlternate={getDefaultWallet(addressClicked)}
          />
        </div>
        <Card
          id={'walletconnect'}
          connector={handleNetworkChange}
          activeChainId={chainId}
          isActivating={isActivating}
          isActive={isConnected}
          error={error}
          setError={setError}
          accounts={[address]}
          provider={walletProvider}
          onConnectDisconnect={onConnectDisconnect}
        />
        <Button className={styles.contextMenu} onClick={(e) => onToggleContextMenu(e, account)}><IConContextMenu /></Button>
      </li>
    :
    null
  )
})

export default WalletConnectCard