import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import VideoPlay from '@/components/UICommon/VideoPlay'
import styles from '@/components/WalletComponents/WalletScanner.module.scss';

export default function PDPThumb({nft, network}) {
  
  const ipfs = function (img) {
    if (img) {
        return img.replace('ipfs://', "https://ipfs.io/ipfs/")
    } else {
        return img;
    }
  }
  
  const getMedia = (NFTData) => {
    console.log("NFTListAlchemy: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> check media ", NFTData.title)
    console.log("image? ", (NFTData?.media[0]?.raw || NFTData?.media[0]?.thumbnail))
    console.log("video? ", NFTData?.rawMetadata?.animation_url)

    if (NFTData && NFTData.rawMetadata && NFTData.rawMetadata.animation_url) {
      let poster = ipfs((NFTData.media[0].raw)? NFTData.media[0].raw : NFTData.media[0].thumbnail);
      let videopath = ipfs(NFTData.rawMetadata.animation_url);

      return (
        <VideoPlay videopath={videopath} poster={poster} />
      )
    } else if (NFTData && NFTData.media[0]) {
      return (
        NFTData.media[0].raw
          ? <img src={ipfs(NFTData.media[0].raw)} alt={"NFT media"}/>
        : <img src={ipfs(NFTData.media[0].thumbnail)} alt={"NFT media"}/>
      )
    } else {
      console.log("Warning: not getting any media for this NFT ")
      return null
    }      
  }

  return (
    <li className={styles.allNFTSItem}>
      <div className={styles.inner}>
        <Link href={`/mynfts/${nft.contract.address}/${nft.tokenId}?network=${network}${(nft?.tokenType)? '&type=' + nft?.tokenType : ''}`}>
          {getMedia(nft)}
          <p>{nft.title}</p>
        </Link>
      </div>
    </li>
  )
}