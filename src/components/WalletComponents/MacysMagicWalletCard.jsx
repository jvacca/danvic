import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import Switch from '../UICommon/Switch'
import ToolTip from '../UICommon/ToolTip'
import Button from '../UICommon/Button'
import Card from './Card'
import IConMacys from '@/assets/icon-macys.svg';
import IConCopy from '@/assets/icon-copy.svg';
import MagicAuthHelper from '../../services/MagicAuthHelper'

import {copyToClipBoard, textEllipsisMid} from '../../services/GlobalUtilities'
import styles from './CardStyles.module.scss'
import {ethers} from 'ethers'
const { Magic } = require('magic-sdk')

// eslint-disable-next-line react/display-name
const MacysMagicWalletCard = forwardRef(({account, show, onStatusChange, onError}, ref) => {
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const [chainId, setChainId] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [isActivating, setIsActivating] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [provider, setProvider] = useState()
  const prevIsActive = useRef(null);
  const [error, setError] = useState(undefined)
  const [showTooltip, setShowTooltip] = useState(false);
  const [tool, setTool] = useState({
    x: 0,
    y: 0
  });
  const prevState = useRef(null);
  const cardRef = useRef()
  const devMode = true;
  
  const toolTipCopy = "This mstylelab digital address is linked to your account and cannot be disconnected or removed.";
  const onCopy = (address) => {
    copyToClipBoard(address);
  }

  const customNodeOptions = {
    rpcUrl: 'https://polygon-rpc.com/', // Polygon RPC URL
    chainId: 137, // Polygon chain id
  }

  async function getNetwork(provider) {
    const { chainId } = await provider.getNetwork();
    //console.log("MacysMagicWalletCard~~~~~~~~~~~~~~~~~~~~~~~ NETWORK? ", chainId)
    return chainId
  }

  useEffect(() => {
    const magicauth = new Magic("pk_live_B2FB59D85E2D18C0", {
      network: customNodeOptions
    });
    
    const local_provider = new ethers.providers.Web3Provider(magicauth.rpcProvider);

    setProvider(local_provider);
    //console.log("MacysMagicWalletCard~~~~~~~~~~~~~~~~~~~~~~~ PROVIDER? ", local_provider)

    getNetwork(local_provider).then((chainid) => {
      console.log("MacysMagicWalletCard: onload, setting wallet data in states");
      
      setChainId(customNodeOptions.chainId)
      setAccounts(account);
      setIsActive(true);
      setIsActivating(false);
    })
  }, []);

  useEffect(() => {
    if (prevIsActive.current !== isActive) {
      if (accounts) console.log("MacysMagicWalletCard: change in status ", 'macys', isActive)

      onStatusChange('macys', isActive, {
        address: account,
        network: customNodeOptions.chainId,
        wallet: 'macys'
      })

      if (isActive) setError(false)
    }

    if (error) {
      onError('macys', error)
    }
  }, [isActive, error])

  useEffect(() => {
    if (isActive && accounts && chainId) {
      if (accounts) console.log("MacysMagicWalletCard: change in account or chain ", 'macys');

      onStatusChange('macys', null, {
        address: account,
        network: customNodeOptions.chainId,
        wallet: 'macys',
        isConnected: true,
        provider: provider
      })
    }
  }, [accounts, chainId])

  useImperativeHandle(ref, () => {
    return {
      // connectWallet() {
      //   console.log("CoinbaseWalletCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
      //   onConnectDisconnect(e, 'coinbase', true)
      // },
      closeContextMenu() {
        cardRef.current.closeFlyout()
      }
    }
  })

  const handleMouseMove = (e) => {
    //console.log("Detecting mouse ", e.pageX, e.pageY)
    setShowTooltip(true);
    setTool ({x: e.pageX - 200, y:e.pageY + 30})
  }

  const handleMouseOut = (e) => {
    setShowTooltip(false);
  }

  const onCloseTooltip = (e) => {
    setShowTooltip(false);
  }

  const getDefaultWallet = (address) => {
    return (address === defaultWallet.address)
  }

  return (
    (show && account)? <li>
      {devMode? 
      <Card
        ref={cardRef}
        id={'macys'}
        activeChainId={chainId}
        isActivating={false}
        isActive={true}
        error={error}
        setError={setError}
        accounts={[account]}
        provider={provider}
        onConnectDisconnect={''}
      />
      :
      <>
        <IConMacys />
        <div className={styles.row}>
          mstylelab<br /><span>{textEllipsisMid(account)}</span>
          <Button onClick={() => onCopy(account)} className={styles.copyBtn}><IConCopy /></Button>
        </div>
        <div className={styles.connectionSwitch} onMouseOver = {handleMouseMove} onMouseOut = {handleMouseOut}><Switch
          id = {'macys'}
          isActive = {true}
          toggleSwitchHandler = {''}
          disable = {true}
        /></div>
        <p className={styles.default}>Default Digital Address</p>
        <p className={styles.status}>Connected</p>
                
        <>
          <div className="tooltipContainer">
            <ToolTip show={showTooltip} copy={toolTipCopy} />
          </div>
          <style jsx>{`
          .tooltipContainer {
            position: relative;
            width: 100%;
            
          }
            .tooltip {
              position: absolute;
              top: ${tool.y}px;
              left: ${tool.x}px;
            }
          `}</style>
        </>
      </>}
    </li>
    :
    null
  )
})

export default MacysMagicWalletCard;