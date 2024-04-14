import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux';
import { coinbaseWallet, hooks } from '../WalletConnectors/coinbaseWallet'
import ContextMenu from '../UICommon/ContextMenu';
import IConContextMenu from '@/assets/icon-contextmenu.svg';
import Button from '../UICommon/Button'
import Card from './Card'
import parse from 'html-react-parser';
import styles from './CardStyles.module.scss';


// eslint-disable-next-line react/display-name
const CoinbaseWalletCard = forwardRef(({account, show, onStatusChange, onRemoveWallet, onSetDefaultWallet, onError, onContextMenuOpen}, ref) => {
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()
  const prevAddressClicked = useRef(null);
  const prevIsActive = useRef(null);
  const [error, setError] = useState(undefined)
  const [addressClicked, setAddressClicked] = useState(null);

  // attempt to connect eagerly on mount
  useEffect(() => {
    coinbaseWallet.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to coinbaseWallet');
      
    })

    if (!account) {
      console.log("CoinbaseWalletCard: Found no account, try to connect ", account)

      setTimeout(() => {
        coinbaseWallet.activate().catch(setError)
      }, 2000)
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      //document.removeEventListener('mousemove', handleMouseMove);
    }
  },[]);

  useEffect(() => {
    if (prevIsActive.current !== isActive) {
      if (accounts) console.log("CoinbaseWalletCard: change in active status coinbase", isActive);

      onStatusChange('coinbase', isActive, {
        address: accounts? accounts[0] : '',
        network: chainId? chainId : '',
        wallet: 'coinbase'
      })

      if (isActive) setError(false)
    }

    if (error) {
      onError('coinbase', error)
    }
  }, [isActive, error])

  useEffect(() => {
    if (isActive && accounts && chainId) {
      if (accounts) console.log("CoinbaseWalletCard: change in account or chain ", 'coinbase');

      onStatusChange('coinbase', null, {
        address: accounts? accounts[0] : '',
        network: chainId? chainId : '',
        wallet: 'coinbase',
        isConnected: true,
        provider: provider
      })
    }
  }, [accounts, chainId])

  useEffect(() => {
    //if (addressClicked) console.log('just checking ------------------_____>', addressClicked)
    prevAddressClicked.current = addressClicked;
    prevIsActive.current = isActive;
  }, [addressClicked, isActive])

  useImperativeHandle(ref, () => {
    return {
      connectWallet() {
        console.log("CoinbaseWalletCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
        onConnectDisconnect(e, 'coinbase', true)
      },
      closeContextMenu() {
        setAddressClicked(null);
      }
    }
  })

  const onConnectDisconnect = (e, id, isOn) => {
    if (isOn) {
      try {
        coinbaseWallet.activate().catch(setError)
      } catch(error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
        setError(error)
      }
    } else {
      if (coinbaseWallet?.deactivate) {
        try {
          coinbaseWallet.deactivate()
        } catch(error) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
          setError(error)
        }
      } else {
        try {
          coinbaseWallet.resetState()
        } catch(error) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
          setError(error)
        }
      }
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
      onContextMenuOpen('coinbase')
    } else {
      setAddressClicked(null);
    }
  }

  const handleRemoveWallet = (walletAddress) => {
    coinbaseWallet.deactivate();
    onRemoveWallet(walletAddress);
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
        id={'coinbase'}
        connector={coinbaseWallet}
        activeChainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
        accounts={accounts}
        provider={provider}
        onConnectDisconnect={onConnectDisconnect}
      />
      <button className={styles.contextMenu} onClick={(e) => onToggleContextMenu(e, account)}><IConContextMenu /></button>
    </li>
    :
    null
  )
})

export default CoinbaseWalletCard;