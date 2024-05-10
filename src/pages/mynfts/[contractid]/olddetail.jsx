// React imports
import React, {useEffect, useState, useRef} from "react";
import {useSelector} from 'react-redux';
import Head from '../../../components/Head';
import ShareModal from '../../../components/shared/ShareModal';
import MoreCollections from "../../../components/Collections/MoreCollections";
import NFTPdp from "../../../components/Collections/NFTPdp";
import ProfileNamePdp from "../../../components/Collections/ProfileNamePdp";
import DigitalItemPdp from "../../../components/Collections/DigitalItemPdp.jsx";
import CoolCatsTrophyPdp from "../../../components/Collections/CoolCatsTrophyPdp.jsx";
import CoolCatsFigurinePdp from "../../../components/Collections/CoolCatsFigurinePdp.jsx";
import axios from 'axios';
import web3 from 'web3'
import {Alchemy, Network} from "alchemy-sdk";
// assets imports
import styles from './nftDetail.module.scss';
//const contracts = require('../../../web3/SmartContracts/contracts.js');

export default function NFTDetail({walletid, tokenid, badgesData}) {
    const [NFTData, setNFTData] = useState(null);
    const [NFTDataByContract, setNFTDataByContract] = useState(null);
    const [ajaxData, setAjaxData] = useState(null);
    const profileName = useSelector((state) => state.account.profileName);
    const [token, setToken] = useState("");
    const [contract, setContract] = useState("");
    const [owner, setOwner] = useState("");
    //const [txn, setTxn] = useState([]);
    const [acquired, setAcquired] = useState([]);
    const detailref = useRef(null);
    const [showShare, setShowShare] = useState(false);
    const [namesave, setNamesave]  = useState("");
            
    const [mcType, setMcType] = useState(null);
    const [mcCategory, setMcCategory] = useState(null);
    const [showMore, setShowMore] = useState(true);

    const [hasCoolCats, setHasCoolCats] = useState([]);

    useEffect(()=>{
        console.log('hasCoolCats has updated', hasCoolCats);
    },[hasCoolCats])
    
    // try {
    //     var path = window.location.pathname.split('/').filter(function (o) {
    //         return o
    //     });
    //     let contract = path[path.length - 2];
    //     if (contract == 'username') {
    //         console.log('set loading true');
    //         setLoading(true);
    //     }
    // } catch(e){}

    let share = function () {
        setShowShare(true)
    }

    let keyswap = [
        'zAkXe4ui1WtGY0jkmTee1IrJ3zI1pewx',
        'K3bqMfa3xxKXjSyyX8Sr2Iy7n3OCNfPX',
        'eflQAy0s_v6rAI1q2CiKQZLf69-qN8z-',
        'vAMzsga-DEPYHrECGcrp0EdpgSh-YMcv',
        "ZfRh6v4NvnEdmXTWp0F8xl3Fzmnn1NEp"
    ]

    /*
    const image = function (img) {
        if (img.indexOf('[PROFILENAME]') > -1) {
            return img.replace('[PROFILENAME]', profileName)
        } else {
            return img;
        }
    };*/
    
    let getTransfers = function (contractaddress, type, nftId, owners) {
        return new Promise(function (resolve, reject) {
            var data = JSON.stringify({
                "jsonrpc": "2.0",
                "id": nftId,
                "method": "alchemy_getAssetTransfers",
                "params": [
                    {
                        "order": "desc",
                        "fromBlock": "0x0",
                        "contractAddresses": [contractaddress],
                        "toAddress": owners ? owners[0] : "",
                        "excludeZeroValue": false,
                        "category": ['erc721', 'erc1155'],
                        "withMetadata": true,
                    }
                ]
            });

            var config = {
                method: 'post',
                url: `https://${type}.g.alchemy.com/v2/${keyswap[Math.floor(Math.random() * keyswap.length)]}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(async function (response) {
                    // Get transactions for the NFT
                    console.log(nftId)
                    let txns = await response['data']['result']['transfers'].filter(
                        txn => web3.utils.hexToNumber(txn['tokenId']) == nftId)
                    // console.log(`transactions ${contractaddress} ${nftId}`,  txns)
                    // console.log('txns', nftId, txns, response['data']['result']['transfers'].map((o)=>{ return Object.assign({token: web3.utils.hexToNumber(o['tokenId'])},o) }), web3.utils.hexToNumber("0x0000000000000000000000000000000000000000000000000000000000000001"));


                    var data = JSON.stringify({
                        "jsonrpc": "2.0",
                        "id": nftId,
                        "method": "alchemy_getAssetTransfers",
                        "params": [
                            {
                                "order": "desc",
                                "fromBlock": txns[0].blockNum,
                                "contractAddresses": [contractaddress],
                                "excludeZeroValue": false,
                                "category": ['erc721', 'erc1155'],
                                "withMetadata": true,
                            }
                        ]
                    });
                    var config = {
                        method: 'post',
                        url: `https://${type}.g.alchemy.com/v2/${keyswap[Math.floor(Math.random() * keyswap.length)]}`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                    axios(config)
                        .then(async function (response) {
                            // console.log('more', response['data']['result']['transfers'])
                            let all = response['data']['result']['transfers'].filter(
                                txn => web3.utils.hexToNumber(txn['tokenId']) == nftId)
                            txns = txns.concat(all);
                            resolve(txns.map((o) => {
                                return Object.assign({token: web3.utils.hexToNumber(o['tokenId'])}, o)
                            }));
                        })

                })
                .catch(function (error) {
                    console.log('error', error);
                    resolve([]);
                });
        })

    }

    let getOwnerOfToken = function (contractaddress, type, nftId) {
        return new Promise(function (resolve, reject) {
            // var data = JSON.stringify({
            //     "jsonrpc": "2.0",
            //     "id": nftId,
            //     "method": "alchemy_getAssetTransfers",
            //     "params": [
            //         {
            //             "order":"desc",
            //             "fromBlock": "0x0",
            //             "contractAddresses": [contractaddress],
            //             // "toAddress": "",
            //             "excludeZeroValue": false,
            //             "category": ['erc721','erc1155'],
            //             "withMetadata": true,
            //         }
            //     ]
            // });

            var config = {
                method: 'get',
                url: `https://${type}.g.alchemy.com/nft/v2/${keyswap[Math.floor(Math.random() * keyswap.length)]}/getOwnersForToken?contractAddress=${contractaddress}&tokenId=${nftId}`,
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                // data: data
            };

            axios(config)
                .then(async function (response) {
                    // Get transactions for the NFT
                    // console.log(nftId)o
                    // let txns = await response['data']['result']['transfers'].filter(
                    //     txn => web3.utils.hexToNumber(txn['tokenId']) == nftId)
                    // // console.log(`transactions ${contractaddress} ${nftId}`,  txns)
                    // console.log('txns', nftId, txns, response['data']['result']['transfers'].map((o)=>{ return Object.assign({token: web3.utils.hexToNumber(o['tokenId'])},o) }), web3.utils.hexToNumber("0x0000000000000000000000000000000000000000000000000000000000000001"));
                    resolve(response);
                })
                .catch(function (error) {
                    console.log('error', error);
                    resolve([]);
                });
        })

    }
    let promiseTranData = function (nftdata, owners) {
        console.log(nftdata, 'promiseTranData')
        if (Object.keys(nftdata).length > 0) {
            return new Promise(function (resolve, reject) {
                [nftdata].forEach(function (polygonnft, i) {
                    getTransfers(polygonnft.contract.address, 'polygon-mainnet', polygonnft.tokenId, owners).then(function (data) {
                        // console.log(data);
                        // setNFTData(filter);
                        resolve(data);
                    });
                })
            })
        } else {
            return false;
        }

    }

    const loadSearchNFTs = (contract, token, hasdata) => {
      console.log("loadSearchNFTs with: ", contract, token, hasdata)
      let owners = [];
      let filter = {};

      if (hasdata) {
        
        let nfts = JSON.parse(sessionStorage.getItem('alchemy'));
        console.log("NFTDetail: getting nft data from session storage ", nfts)
        // assume all tokens are polygon with one exception
        let network = "polygon-mainnet";
        if (contract == '0x449f661c53ae0611a24c2883a910a563a7e42489') {
            network = "eth-mainnet";
        }
        // setContract(path[path.length-2])
        // console.log('test nfts', nfts,contract, token, path[path.length-2]);

        // search NFT from session storage data
        filter = nfts.find((o) => {
            return o.contract.address == contract && o.tokenId == token
        })
        console.log('nft', filter);

        // set state NFTData
        setNFTData(filter);
        
        // make an Alchemy API call to get the owner of this NFT
        getOwnerOfToken(contract, network, token).then(function (gotowner) {
            // console.log('gotowner', gotowner["data"].owners)
            if (gotowner && gotowner["data"]) {
              owners = gotowner["data"].owners;
              setOwner(gotowner['data'].owners[0])
            }
        })

      } else {
        // if we don't have the NFT data from session storage, load the NFT data from Alchemy API
        
        let network = "polygon-mainnet";
        if (contract == '0x449f661c53ae0611a24c2883a910a563a7e42489') {
            network = "eth-mainnet";
        }
        

        getOwnerOfToken(contract, network, token).then(async function (ownerarr) {
            if (ownerarr && ownerarr['data'] && ownerarr['data'].owners.length > 0) {
                setOwner(ownerarr['data'].owners[0])

                const settings = {
                    apiKey: keyswap[Math.floor(Math.random() * keyswap.length)], // Replace with your Alchemy API Key.
                    network: network == 'eth-mainnet' ? Network.ETH_MAINNET : Network.MATIC_MAINNET, // Replace with the network your NFT is on.
                };

// Creating an Alchemy instance to make calls to the Alchemy API
                const alchemy = new Alchemy(settings);

// Function to get the metadata of an NFT: accepts the NFT contract address and the token ID to get the metadata of
                async function getNFTMetadata(nftContractAddress, tokenId) {
                    // Making a call to the Alchemy API to get the metadata
                    const response = await alchemy.nft.getNftMetadata(
                        nftContractAddress,
                        tokenId
                    );
                    return response; // returning the metadata
                }

                filter = await getNFTMetadata(contract, token)
                // console.log(p, 'p');
                setNFTData(filter);

                //get token transfers history if any
                getTransfers(contract, network, token, ownerarr['data'].owners).then(function (data) {
                    // console.log(data, 'ajax');
                    filter['transactions'] = data;
                    try {
                        setAcquired(new Date(data[0].metadata.blockTimestamp).toLocaleDateString('en-US'))
                    } catch (e) {
                    }
                    setNFTData(filter);
                })

            }
        })
      }


      let scrolled = false;

      window.onscroll = function () {
          if (detailref.current && !scrolled) {
              if (window.scrollY > 100) {
                  console.log(detailref, 'detailref~~~~~~');
                  scrolled = true;
                  if (window.location.pathname.indexOf('username') == -1) {
                      promiseTranData(filter, owners).then(function (data) {
                          setTimeout(function () {
                              filter['transactions'] = data;
                              try {
                                  setAcquired(new Date(data[0].metadata.blockTimestamp).toLocaleDateString('en-US'))
                              } catch (e) {
                              }
                              setNFTData(filter);
                          }, 100)
                      });
                  }
              }
          }
      }
      // console.log(detailref, 'detail');
    }

  
    // Checking if badgesData and NFTData are available before rendering
    if (NFTDataByContract) {
        if (NFTDataByContract.tokenId == '[PROFILENAME]') {
            let usernamejson = JSON.parse(JSON.stringify(NFTDataByContract).replace(/\[PROFILENAME\]/g, profileName));
            setNFTDataByContract(usernamejson)
        }
    }

    const renderBranchingItems = (contract, token) => {
      // check if this is a profilename digital item
      if (contract == 'username') {
          console.log('NFTDetails: username pdp');

          // setting states for More Collections
          setMcType('digitalItem');
          setMcCategory('avatarClothes');

          setToken(token);
          setContract(contract);

          if (!localStorage.getItem('journee-collect')) {
              setShowMore(false); // hide if never entered journee
          } else {
              if (JSON.parse(localStorage.getItem('journee-collect')).indexOf('star_02') == -1) { // entered metaverse, hide tshirt if not complete journee
                  setShowMore(false);
              }
          }
          if (window.location.pathname.indexOf(profileName) == -1) { // for public view hide tshirt
              setShowMore(false);
          }

        // check if this is a digital item like avatar clothes
      } else if (contract == 'digitalitem') {
          console.log('NFTDetails: digital fashion item pdp', token, contract);

          setMcType('digitalItem');
          setMcCategory('profileName');

          // token =
          setToken(token);
          setContract(contract);
      } else if (contract === 'digitalCollectible' && token == 'trophy') {
          console.log('NFTDetails: cool cats trophy pdp', contract, token);

          setMcType('digitalCollectible');
          setMcCategory('figurine');

          // token =
          setToken(token);
          setContract(contract);
      } else if (contract === 'digitalCollectible' && token == 'figurine') {
          console.log('NFTDetails: cool cats figurine pdp', contract, token);

          setMcType('digitalCollectible');
          setMcCategory('trophy');

          // token =
          setToken(token);
          setContract(contract);
      } else {
          console.log('NFTDetails: NFT pdp');

          let hasdata = false;
          // grab chosen NFT Data from session storage
          if (sessionStorage.getItem('alchemy')) {
            // set states for more collections
            setMcType('nfts');
            setMcCategory('all');

            let nfts = JSON.parse(sessionStorage.getItem('alchemy'));
            // search for the NFT given the 2 parmeters
            let exists = nfts.filter((o) => {
                return o.contract.address == contract && o.tokenId == token
            })
            // console.log('nft', filter);
            // if we get a result we have the NFT data
            if (exists.length > 0) {
                hasdata = true;
            }

            loadSearchNFTs(contract, token, hasdata)
        }
      }

      let params = new URLSearchParams(window.location.search);
      
      if (params.get('claim') === 'trophy' || params.get('claim') === 'figurine') {
        console.log("NFTDetails: Hiding Show more because this is a claim page")
            //only show if user has coolcats item
        setShowMore(false);
      }
    }

    // console.log('badgesData, nftBadge, NFTData, NFTDataByContract', badgesData, nftBadge, profileName, NFTData, NFTDataByContract)
    useEffect(() => {
      if (namesave === "") {
        setNamesave(profileName? profileName : sessionStorage.getItem('profileName'))
      }
    }, [namesave]);

    // ***** Runs once on page load*****
    useEffect(() => {       
        
        // grab token id and contract address from the path in the URL
        var path = window.location.pathname.split('/').filter(function (o) {
            return o
        });
        let token = path[path.length - 1];
        let contract = path[path.length - 2];
        console.log('parameters ', contract, token);
        renderBranchingItems(contract, token);
        
        //if (((!badgesData && !nftBadge ) || (!NFTData && !NFTDataByContract)) && contract !== 'username') {
          //setLoading(false);
        //}
        
        
    }, []);

    const onCloseModal = (e) => {
      setShowShare(false);
    }

    const ipfs = function (img) {
        if (img) {
            return img.replace('ipfs://', "https://ipfs.io/ipfs/")
        } else {
            return img;
        }
    }

    const sharepicture = (NFTData) => {
        if (window.location.pathname.indexOf('username') > -1) {
            return `https://storage.googleapis.com/imp-projects-c/nft/usernames/${token}.png`;
        } else {
            if (NFTData && NFTData.media[0]) {
                return (
                    NFTData.media[0].raw
                        ? ipfs(NFTData.media[0].raw)
                        : ipfs(NFTData.media[0].thumbnail)
                )
            } else {
                return "https://storage.googleapis.com/imp-projects-c/nft/usernames/MSTYLELAB.png"
            }
        }
    }

    const shareurl = () => {
        return window.location.href;
    }

    const onSelect = (contract, token) => {
      console.log("Selecting ~~~~~~~~~~~~~>> ", contract, token);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      renderBranchingItems(contract, token);
    }

    //if (loading) {
        //return (<div suppressHydrationWarning>Loading...</div>);
    //} else {
        return (
          <div suppressHydrationWarning>
            <Head title="Macy's STYL - NFT Detail" />
            {NFTData &&
            <>
              <meta property="og:image" content={sharepicture(NFTData)} />
              <meta property="og:url" content={shareurl()} />
              <meta name="description" content="Macy's mstylelab"/>
              <meta name="twitter:card" content="photo"/>
              <meta name="twitter:site" content="@macysmstylelab"/>
              <meta name="twitter:title" content="Macy's mstylelab" />
              <meta name="twitter:description" content="My mstylelab digital fabric has officially materialized. Check it out and claim your own at macys.com/mystylelab! @macys #mstylelab"/>
              <meta name="twitter:image" content={sharepicture(NFTData)} />
              <meta name="twitter:url" content={shareurl()} />
              <meta property="og:type" content="article" />
              <meta property="og:title" content="Macy&#39;s mstylelab" />
              <meta property="og:description" content="It’s here! Check out my new digital fabric from mstylelab. Want to claim yours, too? Head over to macys.com/mystylelab. @macys #mstylelab" />
            </>
            }
            <ShareModal
              showModal={showShare}
              onCloseModal={onCloseModal}
              namesave={profileName ? profileName : namesave}
              nftMedia={(NFTData && NFTData.media)? ipfs(NFTData.media[0].raw) : null}
            />
            <div className={styles.detailsFrame}>
              {NFTData && <NFTPdp NFTData={NFTData} owner={owner} share={share} />}

              {contract === "username" ? <ProfileNamePdp token={token} share={share} /> : <div></div>}

              {contract === "digitalitem" ? <DigitalItemPdp token={token} share={share} /> : <div></div>}

              {(contract === "digitalCollectible" && token === 'trophy') ? <CoolCatsTrophyPdp setHasCoolCats={setHasCoolCats} /> : <div></div>}

              {(contract === "digitalCollectible"  && token === 'figurine') ? <CoolCatsFigurinePdp share={share} setHasCoolCats={setHasCoolCats}/> : <div></div>}

              {(mcType && mcCategory && showMore) && <MoreCollections type={mcType} category={mcCategory} onselect={onSelect} hasCoolCats={hasCoolCats} />}
            </div>
          </div>
        );
    }

//}

export async function getServerSideProps({params}) {
    // const res = await fetch(
    //   "https://storage.googleapis.com/imp-projects-c/nft/nftBadges.json"
    // );
    // const badgesData = await res.json();
    // console.log(badgesData);
    return {
        props: {
            walletid: params.walletid,
            tokenid: params.id,
            // badgesData
        }
    }
}