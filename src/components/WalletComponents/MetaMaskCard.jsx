import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux';
import { hooks, metaMask } from '../WalletConnectors/metaMask'
import ContextMenu from '../UICommon/ContextMenu';
import IConContextMenu from '@/assets/icon-contextmenu.svg';
import Button from '../UICommon/Button'
import Card from './Card'
import parse from 'html-react-parser';
import styles from './CardStyles.module.scss';


// eslint-disable-next-line react/display-name
const MetaMaskCard = forwardRef(({account, show, onStatusChange, onRemoveWallet, onSetDefaultWallet, onError, onContextMenuOpen}, ref) => {
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
    
    metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask');
      
    })

    if (!account) {
      console.log("MetamaskCard: Found no account, try to connect ", account)

      setTimeout(() => {
        metaMask.activate().catch(setError)
      }, 2000)
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      //document.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    if (prevIsActive.current !== isActive) {
      if (accounts) console.log("MetamaskCard: change in status metamask", isActive);

      onStatusChange('metamask', isActive, {
        address: accounts? accounts[0] : '',
        network: chainId? chainId : '',
        wallet: 'metamask'
      })

      if (isActive) setError(false)
    }

    if (error) {
      onError('metamask', error)
    }
  }, [isActive, error])

  useEffect(() => {
    if (isActive && accounts && chainId) {
      if (accounts) console.log("MetamaskCard: change in account or chain ", 'metamask');

      onStatusChange('metamask', null, {
        address: accounts? accounts[0] : '',
        network: chainId? chainId : '',
        wallet: 'metamask',
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
        console.log("MetamaskCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
        onConnectDisconnect(e, 'metmask', true)
      },
      closeContextMenu() {
        setAddressClicked(null);
      }
    }
  })

  const onConnectDisconnect = (e, id, isOn) => {
    if (isOn) {
      try {
        metaMask.activate().catch((error) => setError(getErrorMsg(error)))
      } catch(error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
        //setError(getErrorMsg(error))
      }
    } else {
      // removing deactivate becasue it does not truly deactivate
      /*
      if (metaMask?.deactivate) {
        try {
          metaMask.deactivate()
        } catch(error) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
          setError(getErrorMsg(error))
        }
      } else {
        try {
          metaMask.resetState()
        } catch(error) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", error)
          setError(getErrorMsg(error))
        }
      }*/
      setError({name:'not allowed', message:'Must disconnect from within the extension'})
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
      onContextMenuOpen('metamask')
    } else {
      setAddressClicked(null);
    }
  }

  const handleRemoveWallet = (walletAddress) => {
    // remving reset because this does nothing to Metmask extension
    //metaMask.resetState()

    // remove only if user disconnected from the extension
    if (!isActive) {
      onRemoveWallet(walletAddress);
    } else {
      // send error state to ask user to deactivate from extension
      setError({name:'not allowed', message:'Must disconnect from within the extension before removing'})
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
          id={'metamask'}
          connector={metaMask}
          activeChainId={chainId}
          isActivating={isActivating}
          isActive={isActive}
          error={error}
          setError={setError}
          accounts={accounts}
          provider={provider}
          onConnectDisconnect={onConnectDisconnect}
        />
        <Button className={styles.contextMenu} onClick={(e) => onToggleContextMenu(e, account)}><IConContextMenu /></Button>
      </li>
    :
    null
  )
})

export default MetaMaskCard
