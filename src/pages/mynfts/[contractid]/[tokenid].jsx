// React imports
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from 'next/navigation'
import Head from '../../../components/Head';
import axios from 'axios';
import web3 from 'web3'
import { Alchemy, Network } from "alchemy-sdk";
import styles from './nftDetail.module.scss';
import { textEllipsisMid } from '@/services/GlobalUtilities';

export default function NFTDetail({ contractid, tokenid }) {
    const [NFTData, setNFTData] = useState(null);
    const profileName = useSelector((state) => state.account.profileName);
    const [acquired, setAcquired] = useState([]);
    const detailref = useRef(null);
    const querystrings = useSearchParams()

    let keyswap = [
        'zAkXe4ui1WtGY0jkmTee1IrJ3zI1pewx',
        'K3bqMfa3xxKXjSyyX8Sr2Iy7n3OCNfPX',
        'eflQAy0s_v6rAI1q2CiKQZLf69-qN8z-',
        'vAMzsga-DEPYHrECGcrp0EdpgSh-YMcv',
        "ZfRh6v4NvnEdmXTWp0F8xl3Fzmnn1NEp"
    ]


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

    function getNFT() {
        return new Promise(function (resolve, reject) {
            const apiKey = keyswap[Math.floor(Math.random() * keyswap.length)]
            const network = (querystrings.get('network')) ? getNetwork(querystrings.get('network')) : Network.ETH_MAINNET
            const tokenType = (querystrings.get('type')) ? querystrings.get('type') : 'ERC721'
            const baseurl = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata`

            var params = {
                contractAddress: contractid,
                tokenId: tokenid,
                refreshCache: false,
                tokenType: tokenType
            }

            const config = {
                method: 'get',
                url: baseurl,
                params: params
            };

            console.log("Getting NFTs with ", params)
            try {
                axios(config)
                    .then((response) => {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        console.log('error', error);
                        resolve([]);
                    });
            } catch (error) {
                console.log("Error getting nfts ", error)
            }
        })
    }

    useEffect(() => {
        if (!NFTData) {
            console.log('parameters ', NFTData, contractid, tokenid);
            getNFT().then((data) => {
                console.log('Got metadata! ----------------- ', data)
                setNFTData(data)
            })
        } else {
            console.log('already got NFTData ', NFTData)
        }
    }, []);

    const ipfs = function (img) {
        if (img) {
            return img.replace('ipfs://', "https://ipfs.io/ipfs/")
        } else {
            return img;
        }
    }

    const getMedia = () => {
        console.log("NFTListAlchemy: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> check media ")

        return <img src={NFTData?.raw?.metadata?.image} alt={"NFT media"} />
    }

    return (
        <div suppressHydrationWarning>
            <Head title="Macy's STYL - NFT Detail" />

            <div className={styles.detailsFrame}>
                {NFTData &&
                    <div className={styles.detailsWrap}>
                        <Link href="/profile/dashboard">Back to dashboard</Link>

                        <div className={styles.content}>
                            <div className={styles.imageContainer}>
                                {getMedia()}
                            </div>
                            <div className={styles.copyContainer}>
                                <h2 data-alt={NFTData.name}>
                                    {NFTData.name}
                                </h2>
                                <p>{NFTData.description}</p>

                                <div className={styles.detailsContent}>
                                    <div className={styles.specs} ref={detailref}>
                                        <ul>
                                            <li className={styles.gradientBackground}>
                                                <span>Contact Address</span>{" "}
                                                {textEllipsisMid(NFTData.contract?.address)}
                                            </li>
                                            <li className={styles.gradientBackground}>
                                                <span>Token ID</span> {NFTData.tokenId}
                                            </li>
                                            <li className={styles.gradientBackground}>
                                                <span>Token Type</span> {NFTData.tokenType}
                                            </li>
                                            <li className={styles.gradientBackground}>
                                                <span>Network</span>
                                                {getNetwork(querystrings.get('network'))}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: {
            contractid: params.contractid,
            tokenid: params.tokenid
        }
    }
}