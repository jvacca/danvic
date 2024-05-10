// React imports
import React, {useEffect, useState, useRef} from "react";
import {useSelector} from 'react-redux';
import Link from "next/link"
import Head from '../../../components/Head';
import axios from 'axios';
import web3 from 'web3'
import {Alchemy, Network} from "alchemy-sdk";
import styles from './nftDetail.module.scss';

export default function NFTDetail({contractid, tokenid}) {
    const [NFTData, setNFTData] = useState(null);
    const profileName = useSelector((state) => state.account.profileName);
    const [acquired, setAcquired] = useState([]);
    const detailref = useRef(null);

    let keyswap = [
        'zAkXe4ui1WtGY0jkmTee1IrJ3zI1pewx',
        'K3bqMfa3xxKXjSyyX8Sr2Iy7n3OCNfPX',
        'eflQAy0s_v6rAI1q2CiKQZLf69-qN8z-',
        'vAMzsga-DEPYHrECGcrp0EdpgSh-YMcv',
        "ZfRh6v4NvnEdmXTWp0F8xl3Fzmnn1NEp"
    ]
    
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
/*
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
*/
  const getNetwork = (id) => {
    switch(id) {
      case 1:
        return Network.ETH_MAINNET
      case 5:
        return Network.ETH_GOERLI
      case 137:
        return Network.MATIC_MAINNET
      case 80001:
        return Network.MATIC_MUMBAI
      default:
          return ''
    }
  }

  function getNFT() {
    return new Promise(function (resolve, reject) {
        const apiKey = keyswap[Math.floor(Math.random() * keyswap.length)]
        const baseurl = `https://polygon-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata`

        const config = {
            method: 'get',
            url: `${baseurl}?contractAddress=${contractid}&tokenId=${tokenid}&refreshCache=false`
        };
        
        console.log("Getting NFTs with ")
        try {
            axios(config)
            .then((response) => {
                resolve(response.data)
            })
            .catch(function (error) {
                console.log('error', error);
                resolve([]);
            });
        } catch(error) {
            console.log("Error getting nfts ", error)
        }
    })
  }

    useEffect(() => {       
        console.log('parameters ', contractid, tokenid);
        getNFT().then((data) => {
            setNFTData(data)
        })
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
        
       return <img src={NFTData?.raw?.metadata?.image} />
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
                    </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export async function getServerSideProps({params}) {
    return {
        props: {
            contractid: params.contractid,
            tokenid: params.tokenid
        }
    }
}