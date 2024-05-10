import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './NFTListAlchemy.module.scss';
import DataProvider from "../../utils/DataProvider";
import LineDivider from "../../components/shared/LineDivider";
import Loading from "../../components/shared/Loading";
import groupBy from 'lodash/groupBy';

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

// import Stats from 'three/examples/jsm/libs/stats.module'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import map_copy from "../../../data/map_copy.json";

export default function NFTList({ nfts, category, onSelect }) {
    //const [view, setView] = useState('grid');
    //const [filter, setFilter] = useState(null);
    //const [profileName, setProfileName] = useState("");
    //const [attributes, setAttributes] = useState({})
    const [listItems, setListItems] = useState([]);
    const [listItems2, setListItems2] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const prevNfts = useRef([]);

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 600);
    };

    const settings = {
      dots: true,
      slidesToShow: 3.1,
      slidesToScroll: 3,
      draggable: true,
      infinite: false,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1.25,
            slidesToScroll: 1
          }
        }
      ]
    };

    const mapfilters = {
        "Parade": [
            "0x47053222a04002eb0b4011d0262892a383be760e", //parade art mask
            "0xC0B615531Dfbd37bc4FC932349A2af6df27968f1", //sweet
            "0x449f661c53aE0611a24c2883a910A563A7e42489", //oncyber
            "0x34ef22168672ea15dd5d663fc73ef68653afb576", //VirtualGalleryPass
//lowercase
            "0x47053222a04002eb0b4011d0262892a383be760e", //parade art mask
            "0xc0b615531dfbd37bc4fc932349a2af6df27968f1", //sweet
            "0x34ef22168672ea15dd5d663fc73ef68653afb576", //VirtualGalleryPass
            "0x449f661c53ae0611a24c2883a910a563a7e42489" //oncyber

        ],
        "Fireworks": [
            "0x9913b6D46eA1Deb31a83020410B07990f4CDd332",
            "0xc74096d4b3e982208d49c29d804d3bdb172f4f6c",
            "0x25bd713A8BF017e6666B8307a78c8AF1AB0c0e1a",
            "0xf9284e70bffBC6B24711CC07fF3041dc20EA23bb",
            "0x990e9b2dc6d911907a874901a013061b9b5ba718",
            "0xdbeb0a1fa6be4e7a7d722ea12602c056ac89106e",
//lowercase
            "0x9913b6d46ea1deb31a83020410b07990f4cdd332",
            "0xc74096d4b3e982208d49c29d804d3bdb172f4f6c",
            "0x25bd713a8bf017e6666b8307a78c8af1ab0c0e1a",
            "0xf9284e70bffbc6b24711cc07ff3041dc20ea23bb",
            "0x990e9b2dc6d911907a874901a013061b9b5ba718",
            "0xdbeb0a1fa6be4e7a7d722ea12602c056ac89106e"
            // "0x47053222a04002eb0b4011d0262892a383be760e"
        ],
        "???": []
    }

    const maptocopy = function(title) {
        if (title.indexOf('96th Macy’s Thanksgiving Day Parade Digital Collectible') == -1
            && title.indexOf('Fireworks AR Art Mask') == -1
            && title.indexOf("Macy's Thanksgiving Parade")  ) {
            return map_copy.collections[title] ? map_copy.collections[title] : title;
        } else if(title.indexOf("Macy's Thanksgiving Parade") > -1){
            return "2021 Macy's Thanksgiving Day Parade (Free Claim)";
        } else if(title.indexOf('Fireworks AR Art Mask') > -1){
            return 'Fireworks AR Art Mask';
        } else {
            return "96th Macy's Thanksgiving Day Parade Digital Collectible"
        }
    }
/*
    const maptocopyname = function(title) {
        if (title.indexOf('96th Macy’s Thanksgiving Day Parade Digital Collectible') == -1) {
            return map_copy.collections[title] ? map_copy.collections[title] : title;
        } else if(title.indexOf('Fireworks AR Art Mask') > -1){
            return title.split('—')[1]
        } else {
            return "96th Macy's Thanksgiving Day Parade Digital Collectible"
        }
    }
*/
    const parseIPFS = function(ipfs) {
        if (ipfs) {
            if (ipfs.indexOf('ipfs://') > -1) {
                return 'https://ipfs.io/ipfs/' + ipfs.replace('ipfs://', '').replace('/ipfs/ipfs/', '/ipfs/');
            } else {
                return ipfs
            }
        } else {
            return ipfs
        }
    }   
   
    
    /*
    let list = nfts.sort((a,b)=>{return a.contract.address - b.contract.address }).map(function(n,i){
        return (
            <li className={styles.allNFTSItem} key={"user"+Math.random()}>
                <div key={n.contract.address+'-'+i}>
                    <div className={styles.inner}>
                        <Link href={`/mynfts/${n.contract.address}/${n.tokenId}`}>
                            <div className={styles.allNftsListItemMedia}>
                                {n.media[0].raw
                                    ? <img src={parseIPFS(n.media[0].raw)}/>
                                    :  <img src={parseIPFS(n.media[0].thumbnail)}/>
                                }
                            </div>
                        </Link>
                    </div>
                    <div className={styles.allNftsItemInfo}>
                        <div className={styles.allNftsItemTitle}>
                            {maptocopy(n.title)}
                        </div>
                    </div>
                </div>
            </li>
        )
    })*/

    const NFTCollectionNamesMap = [
        {
            name: "2021 Macy’s Thanksgiving Day Parade Collection",
            address: "0xc0b615531dfbd37bc4fc932349a2af6df27968f1"
        },
        {
            name: "2022 Macy's Thanksgiving Day Parade (Free Claim) Collection",
            address: "0x47053222a04002eb0b4011d0262892a383be760e"
        },
        {
            name: "2022 Macy's Virtual Gallery Pass Collection",
            address: "0x34ef22168672ea15dd5d663fc73ef68653afb576"
        },
        {
            name: "2022 Macy's Fireworks AR Art Mask Collection",
            address: "0x25bd713A8BF017e6666B8307a78c8AF1AB0c0e1a"
        },
        {
            name: "2022 Macy's 4th of July Fireworks Poster Collection",
            address: "0x9913b6D46eA1Deb31a83020410B07990f4CDd332"
        },
        {
            name: "2022 Macy's Fireworks Phygital T-Shirt Collection",
            address: "0xdbeb0a1fa6be4e7a7d722ea12602c056ac89106e"
        },
        {
            name: "",
            address: ""
        },
        {
            name: "",
            address: ""
        },
        {
            name: "",
            address: ""
        }
    ]

    const getMedia = (NFTData) => {
      //console.log("NFTListAlchemy: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> check media ", NFTData.title)
      //console.log("image? ", (NFTData.media[0].raw || NFTData.media[0].thumbnail))
      //console.log("video? ", NFTData.rawMetadata.animation_url)

      if (NFTData && NFTData.rawMetadata && NFTData.rawMetadata.animation_url) {
        return (
            <>
                <video controls playsInline loop preload={"metdata"} poster={parseIPFS((NFTData.media[0].raw)? NFTData.media[0].raw : NFTData.media[0].thumbnail)}>
                    <source
                    src={parseIPFS(NFTData.rawMetadata.animation_url)}
                    type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
                <div className={styles.nftVideoOverlay}></div>
            </>
        )
      } else if (NFTData && NFTData.media[0]) {
        return (
          NFTData.media[0].raw
          ? <img src={parseIPFS(NFTData.media[0].raw)}/>
          :  <img src={parseIPFS(NFTData.media[0].thumbnail)}/>
        )
      } else {
        return null
      }      
    }

    useEffect(() => {
      
      
      if (JSON.stringify(prevNfts.current) !== JSON.stringify(nfts)) {
        console.log("************************ Rerendering! ************************");
        console.log('NFTListAlchemy: all alchemy nfts', nfts);
        let list = [];
        let list2 = []
          let fireworks = nfts.filter((o)=>{ return mapfilters["Fireworks"].indexOf(o.contract.address) > -1})
          let parade = nfts.filter((o)=>{ return mapfilters["Parade"].indexOf(o.contract.address) > -1})

          // const groupedNFTs = groupBy(nfts, nft => nft.contract.address);
          const groupedNFTs = groupBy(nfts, nft => nft.contract.address);
          const groupedNFTs2 = groupBy(parade, nft => nft.contract.address);
          const groupedNFTs3 = groupBy(fireworks, nft => nft.contract.address);


          Object.entries(groupedNFTs3).forEach(([address, nfts]) => {
              let group = nfts.map((n, i) => (
                  <div className={styles.allNFTSItem} key={"user"+Math.random()}>
                      <div key={n.contract.address+'-'+i}>
                          <div className={styles.inner}>
                            {onSelect?
                              <button onClick={(e) => onSelect(n.contract.address, n.tokenId)}>
                                  <div className={styles.allNftsListItemMedia}>
                                    {getMedia(n)}
                                  </div>
                              </button>
                              :
                              <Link href={`/mynfts/${n.contract.address}/${n.tokenId}`}>
                                  <div className={styles.allNftsListItemMedia}>
                                    {getMedia(n)}
                                  </div>
                              </Link>}
                          </div>
                          <div className={styles.allNftsItemInfo}>
                              <div className={styles.allNftsItemTitle}>
                                  {maptocopy(n.title)}
                                  {(() => {
                                      const collection = NFTCollectionNamesMap.filter(obj => obj.address === n.contract.address)[0];
                                      return <p>{collection ? "/" + collection.name : ''}</p>;
                                  })()}
                              </div>
                          </div>
                      </div>
                  </div>
              ))

              list.push(group);
          });  

          Object.entries(groupedNFTs2).forEach(([address, nfts]) => {
              let group = nfts.map((n, i) => (
                  <div className={styles.allNFTSItem} key={"user"+Math.random()}>
                      <div key={n.contract.address+'-'+i}>
                          <div className={styles.inner}>
                            {onSelect?
                              <button onClick={(e) => onSelect(n.contract.address, n.tokenId)}>
                                  <div className={styles.allNftsListItemMedia}>
                                    {getMedia(n)}
                                  </div>
                              </button>
                              :
                              <Link href={`/mynfts/${n.contract.address}/${n.tokenId}`}>
                                  <div className={styles.allNftsListItemMedia}>
                                    {getMedia(n)}
                                  </div>
                              </Link>}
                          </div>
                          <div className={styles.allNftsItemInfo}>
                              <div className={styles.allNftsItemTitle}>
                                  {maptocopy(n.title)}
                                  {(() => {
                                      const collection = NFTCollectionNamesMap.filter(obj => obj.address === n.contract.address)[0];
                                      return <p>/ {collection ? collection.name : 'Unknown Collection'}</p>;
                                  })()}
                              </div>
                          </div>
                      </div>
                  </div>
              ))

              list2.push(group);
          });

          console.log('NFTListAlchemy: category of nfts? ', category);
          
          if (category === 'fireworks') {
            setListItems(list);
          } else if (category === 'parade') {
            setListItems2(list2);
          } else {
            setListItems(list);
            setListItems2(list2);
          }
      }
      
      prevNfts.current = nfts;
      
    }, [nfts]);

    useEffect( () => {
      updateViewport(); // Initial check
      window.addEventListener("resize", updateViewport); // Attach listener

      return () => {
          window.removeEventListener("resize", updateViewport); // Clean up listener
      };
    }, []);

    return (
      <>
        <div className={styles.allNFTS}>
            <div className={styles.wrapper}>

                        {(listItems.length > 0 && listItems.length <= 3 && !isMobile) &&
                        <div className={styles.allNFTSList}>
                            {listItems}
                        </div>}

                        {(listItems.length > 3 || (isMobile && listItems.length > 1) ) &&
                        <div className={styles.allNFTSList2}>
                          <Slider {...settings}>
                            {listItems}
                          </Slider>
                        </div>}
                        
                        <div className={styles.groupDivider}>
                        <hr/>
                        </div>

                        {(listItems2.length > 0 && listItems2.length <= 3 && !isMobile) &&
                        <div className={styles.allNFTSList}>
                            {listItems2}
                        </div>}

                        {(listItems2.length > 3 || (isMobile && listItems.length > 1) ) &&
                        <div className={styles.allNFTSList2}>
                          <Slider {...settings}>
                            {listItems2}
                          </Slider>
                        </div>}
                   
            </div>
        </div>
      </>
    )
}