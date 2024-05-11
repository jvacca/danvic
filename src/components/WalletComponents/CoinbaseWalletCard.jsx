import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux';
import { coinbaseWallet, hooks } from '../WalletConnectors/coinbaseWallet'
import Card from './Card'

// eslint-disable-next-line react/display-name
const CoinbaseWalletCard = forwardRef(({account, show, onStatusChange, onError}, ref) => {
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
    coinbaseWallet.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to coinbaseWallet');
      
    })

    if (!account) {
      console.log("CoinbaseWalletCard: Found no account, try to connect ", account)

      setTimeout(() => {
        coinbaseWallet.activate().catch(setError)
      }, 2000)
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
    prevIsActive.current = isActive;
  }, [isActive])

  useImperativeHandle(ref, () => {
    return {
      connectWallet() {
        console.log("CoinbaseWalletCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
        onConnectDisconnect(e, 'coinbase', true)
      },
      closeContextMenu() {
        cardRef.current.closeFlyout()
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

  

  const handleRemoveWallet = (walletAddress) => {
    coinbaseWallet.deactivate();
    //onRemoveWallet(walletAddress);
  }

  const getDefaultWallet = (address) => {
    return (address === defaultWallet.address)
  }

  return (
    (show && account)? <li>
      <Card
        ref={cardRef}
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
        onRemoveWallet={handleRemoveWallet}
      />
    </li>
    :
    null
  )
})

export default CoinbaseWalletCard;