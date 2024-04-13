import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import Switch from '../UICommon/Switch'
import ToolTip from '../UICommon/ToolTip'
import Button from '../UICommon/Button'
import Card from './Card'
import IConMacys from '@/assets/icon-macys.svg';
import IConCopy from '@/assets/icon-copy.svg';
import ContextMenu from '../UICommon/ContextMenu';
import IConContextMenu from '@/assets/icon-contextmenu.svg'
import MagicAuthHelper from '../../utils/MagicAuthHelper'

import {copyToClipBoard, textEllipsisMid} from '../../utils/GlobalUtilities'
import styles from './CardStyles.module.scss'
import {ethers} from 'ethers'
const { Magic } = require('magic-sdk')

// eslint-disable-next-line react/display-name
const MacysMagicWalletCard = forwardRef(({account, show, onStatusChange, onRemoveWallet, onSetDefaultWallet, onError, onContextMenuOpen}, ref) => {
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const [chainId, setChainId] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [isActivating, setIsActivating] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [provider, setProvider] = useState()
  const prevAddressClicked = useRef(null);
  const prevIsActive = useRef(null);
  const [error, setError] = useState(undefined)
  const [addressClicked, setAddressClicked] = useState(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tool, setTool] = useState({
    x: 0,
    y: 0
  });
  const prevState = useRef(null);
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
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      //document.removeEventListener('mousemove', handleMouseMove);
      
    }
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


  useEffect(() => {
    //if (addressClicked) console.log('just checking ------------------_____>', addressClicked)
    prevAddressClicked.current = addressClicked;
    prevIsActive.current = addressClicked
  }, [addressClicked, isActive])

  useImperativeHandle(ref, () => {
    return {
      // connectWallet() {
      //   console.log("CoinbaseWalletCard:~~~~~~~~~~~Connecting via ref~~~~~~~~~~~~ ")
      //   onConnectDisconnect(e, 'coinbase', true)
      // },
      closeContextMenu() {
        setAddressClicked(null);
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

  const handleClickOutside = (e) => {
    //console.log("resetting display of context menu");
    setAddressClicked(null);
  }

  const onToggleContextMenu = (e, address) => {
    e.stopPropagation();
    if (!prevState.current) {
      setAddressClicked(address);
      onContextMenuOpen('macys')
    } else {
      setAddressClicked(null);
    }
  }

  const onHideContextMenu = (e, address) => {
    setAddressClicked(null);
  }

  const onCloseTooltip = (e) => {
    setShowTooltip(false);
  }

  const getDefaultWallet = (address) => {
    return (address === defaultWallet.address)
  }

  return (
    (show && account)? <li>
      <div className={styles.contextMenuContainer2}>
        <ContextMenu
          walletAddress={addressClicked}
          onRemoveWallet={''} 
          onSetDefaultWallet={''}
          onHideContextMenu={onHideContextMenu}
          onAlternate={getDefaultWallet(addressClicked)}
        />
      </div>
      {devMode? 
      <Card
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
        <Button className={styles.contextMenu} onClick={(e) => onToggleContextMenu(e, account)}><IConContextMenu /></Button>
    </li>
    :
    null
  )
})

export default MacysMagicWalletCard;