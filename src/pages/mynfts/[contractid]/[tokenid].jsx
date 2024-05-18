// React imports
import React, { useEffect, useState, useRef } from "react"
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Head from '@/components/Head'
import PDP from "./PDP"
import {Network} from "alchemy-sdk";
import styles from './nftDetail.module.scss';

export default function NFTDetail({ contractid, tokenid }) {
    const querystrings = useSearchParams()

    const getNetwork = (id) => {
        switch (id) {
            case '1':
                return Network.ETH_MAINNET
            case '5':
                return Network.ETH_GOERLI
            case '137':
                return Network.MATIC_MAINNET
            case '80001':
                return Network.MATIC_MUMBAI
            default:
                return ''
        }
    }

    const network = (querystrings.get('network')) ? getNetwork(querystrings.get('network')) : Network.ETH_MAINNET
    const tokenType = (querystrings.get('type')) ? querystrings.get('type') : 'ERC721'
    
    return(
        <div suppressHydrationWarning>
            <Head title="Macy's STYL - NFT Detail" />
            <PDP 
                contractid={contractid}
                tokenid={tokenid}
                tokenType={tokenType}
                network={network}
            />
        </div>
    )
}

export async function getServerSideProps({ params }) {
    return {
        props: {
            contractid: params.contractid,
            tokenid: params.tokenid
        }
    }
}