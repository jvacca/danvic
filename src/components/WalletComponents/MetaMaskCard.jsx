import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux';
import { hooks, metaMask } from '../WalletConnectors/metaMask'
import Button from '../UICommon/Button'
import Card from './Card'
import parse from 'html-react-parser';
import styles from './CardStyles.module.scss';


// eslint-disable-next-line react/display-name
const MetaMaskCard = forwardRef(({account, show, onStatusChange, onError}, ref) => {
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()
  const prevIsActive = useRef(null);
  const [error, setError] = useState(undefined)
  const cardRef = useRef()

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
    prevIsActive.current = isActive;
  }, [isActive])  

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
        cardRef.current.closeFlyout()
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

  const handleRemoveWallet = (walletAddress) => {
    // remving reset because this does nothing to Metmask extension
    //metaMask.resetState()

    // remove only if user disconnected from the extension
    if (isActive) {
      // send error state to ask user to deactivate from extension
      setError({name:'not allowed', message:'Must disconnect from within the extension before removing'})
    }
  }

  const getDefaultWallet = (address) => {
    return (address === defaultWallet.address)
  }

  return (
    (show && account)? <li>
        <Card
          ref={cardRef}
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
          onRemoveWallet={handleRemoveWallet}
        />
      </li>
    :
    null
  )
})

export default MetaMaskCard
