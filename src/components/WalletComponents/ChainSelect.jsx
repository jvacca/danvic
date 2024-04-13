import React, { useEffect, useState} from 'react'
import { ethers } from "ethers";
import {useWeb3ModalState} from '@web3modal/ethers5/react'
import { CHAINS, getAddChainParameters } from '../WalletConnectors/chains'

export default function ChainSelect({walletType, activeChainId, connector}) {
  const chainIds = Object.keys(CHAINS).map(Number)
  let { selectedNetworkId } = useWeb3ModalState();
  const [desiredChainId, setDesiredChainId] = useState(null)

  useEffect(() => {
    if (!desiredChainId && activeChainId) setDesiredChainId(activeChainId)
  }, [activeChainId])

  const switchChain = (selectedChainId) => {
    if (walletType === 'metamask' || walletType ==='coinbase'){
      try {
        connector.activate(getAddChainParameters(selectedChainId)).then(() => {
          
        })
        .catch((error) => {
          console.log("error? ", error);
        })
      } catch(error) {
        console.log("error? ", error);
      }
    } else if (walletType === 'walletconnect' || walletType === 'magic') {
      try {
        connector(selectedChainId);
      } catch(error) {
        console.log("error? ", error);
      }
    } else {
       //TODO: switch chains for Magic and WalletConnect
    }
    
    setDesiredChainId(selectedChainId)
  }

  return (
    activeChainId && <select
      value={activeChainId}
      onChange={((e) => {
        switchChain(Number(e.target.value))
      })}
    >
      <option hidden disabled>Select Chain</option>
      {chainIds && chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>{chainId && CHAINS[chainId].name}</option>
      ))}
    </select>
  )
}