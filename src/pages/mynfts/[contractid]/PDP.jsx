import React, { useEffect, useState, useRef } from "react"
import PDPpage from "./PDPpage"
import axios from 'axios'


export default function PDP({ contractid, tokenid, tokenType, network }) {
  const [NFTData, setNFTData] = useState(null);

  let keyswap = [
    'zAkXe4ui1WtGY0jkmTee1IrJ3zI1pewx',
    'K3bqMfa3xxKXjSyyX8Sr2Iy7n3OCNfPX',
    'eflQAy0s_v6rAI1q2CiKQZLf69-qN8z-',
    'vAMzsga-DEPYHrECGcrp0EdpgSh-YMcv',
    "ZfRh6v4NvnEdmXTWp0F8xl3Fzmnn1NEp"
  ]

  const ipfs = function (img) {
    if (img) {
        return img.replace('ipfs://', "https://ipfs.io/ipfs/")
    } else {
        return img;
    }
  }

  function getNFT() {
    return new Promise(function (resolve, reject) {
        const apiKey = keyswap[Math.floor(Math.random() * keyswap.length)]
        
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
  }, [])

  return (
    <PDPpage NFTData={NFTData} network={network} />
  )
}