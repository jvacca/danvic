import React, {useState, useRef, useEffect} from "react";
import Link from 'next/link';
import VideoPlay from '../../components/shared/VideoPlay'
import nftBadge from '../../../data/nftCopyMapping.json';
import styles from '../../pages/mynfts/[walletid]/nftDetail.module.scss';
import sitewideStyles from '../../styles/sitewide.module.scss';
import buttonStyles from '../../components/shared/Button.module.scss';
import {textEllipsisMid} from '../../utils/GlobalUtilities';
import BadgeButton from '../../components/Collections/BadgeButton';
import IconPlus from '../../components/shared/IconPlus';
import IconMinus from "../../components/shared/IconMinus";
import map_obj from '../../../data/map_copy.json';
import axios from 'axios';
import web3 from 'web3'

export default function NFTPdp({NFTData, owner, share}) {
  const detailref = useRef(null);
  const [acquired, setAcquired] = useState([]);
  const [transactions, setTransactions] = useState(null);
  const [toggleUtility, setToggleUtility] = useState(false);
  const [toggleDetails, setToggleDetails] = useState(false);

  const handleUtilityToggle = () => {
    setToggleUtility(!toggleUtility)
  }

  const handleDetailsToggle = () => {
    setToggleDetails(!toggleDetails);
  };

  const ipfs = function (img) {
    if (img) {
        return img.replace('ipfs://', "https://ipfs.io/ipfs/")
    } else {
        return img;
    }
  }

  const getMedia = (NFTData) => {
    console.log("NFTListAlchemy: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> check media ", NFTData.title)
    console.log("image? ", (NFTData.media[0].raw || NFTData.media[0].thumbnail))
    console.log("video? ", NFTData.rawMetadata.animation_url)

    if (NFTData && NFTData.rawMetadata && NFTData.rawMetadata.animation_url) {
      let poster = ipfs((NFTData.media[0].raw)? NFTData.media[0].raw : NFTData.media[0].thumbnail);
      let videopath = ipfs(NFTData.rawMetadata.animation_url);

      return (
        <VideoPlay videopath={videopath} poster={poster} />
      )
    } else if (NFTData && NFTData.media[0]) {
      return (
        NFTData.media[0].raw
        ? <img src={ipfs(NFTData.media[0].raw)}/>
        : <img src={ipfs(NFTData.media[0].thumbnail)}/>
      )
    } else {
      console.log("Warning: not getting any media for this NFT ")
      return null
    }      
  }

  const getNFTTitle = function (nft) {
    //match by attributes
    let name = nft.title;
    try {
        // try grabbing from the copy mapping json first if it's not a thanksgiving collection item
        if (nft.contract.address !== '0xc0b615531dfbd37bc4fc932349a2af6df27968f1' && nft.contract.address !== '0x47053222a04002eb0b4011d0262892a383be760e') {
          let found = nftBadge.nfts.find(el => el.contractAddress === nft.contract.address)
          console.log("NFTDetail: found contract address? ", found)
          return found.name
        }
        else if (nft.attributes) {

            let traits = nft.attributes.map(function (o) {
                return o.trait_type
            });
            let traitsv = nft.attributes.map(function (o) {
                return o.value
            });

            if (traits.indexOf('Balloon') > -1) {
                try {
                    name = nft.attributes.filter((o) => {
                        return o.trait_type === "Balloon"
                    })[0].value;
                } catch (e) {
                }
            } else if (nft.title.indexOf('96th Macy’s Thanksgiving Day Parade Digital Collectible') > -1) {
                return 'sdsdf'
            } else {
                // console.log(traits, traitsv, 'traits of this nft')
                if (traitsv.length > 0) {
                    // all alt names map_obj.nfts
                    map_obj.nfts.forEach(function (o, i) {
                        const containsAll = Object.values(o.trait_type).every(element => {
                            return traitsv.includes(element);
                        });
                        if (containsAll) {
                            // console.log(map_obj.nfts[i],  map_obj.nfts[i].alt);
                            name = map_obj.nfts[i].alt;
                        } else {
                            name = nft.name;
                        }
                    })
                } else {
                    name = nft.name;
                }
            }

        } else if (nft.rawMetadata) {
            if (nft.rawMetadata.attributes) {
                let type = nft.rawMetadata.attributes.find((o) => {
                    return o.trait_type === "Balloon"
                });
                let character = nft.rawMetadata.attributes.find((o) => {
                    return o.trait_type === "Character"
                });
                if (type) {
                    name = type.value
                }
                if (nft.title.indexOf('96th Macy’s Thanksgiving Day Parade') > -1) {
                    if (character.value.indexOf('Turkey') > -1) {
                        name = "Turkey"
                    } else if (character.value.indexOf('Clown') > -1) {
                        name = "Clown"
                    } else if (character.value.indexOf('Cheerleader') > -1) {
                        name = "Cheerleader"
                    } else if (character.value.indexOf('Firefighter') > -1) {
                        name = "Firefighter"
                    } else if (character.value.indexOf('Policeman') > -1) {
                        name = "Policeman"
                    }  else if (character.value.indexOf('Girl') > -1) {
                        name = "Girl"
                    }  else if (character.value.indexOf('Guy') > -1) {
                        name = "Guy"
                    } else if (character.value.indexOf('Guitarist') > -1) {
                        name = "Guitarist"
                    } else if (character.value.indexOf('Santa') > -1) {
                        name = "Santa"
                    } else if (character.value.indexOf('Elf') > -1) {
                        name = "Elf"
                    }else {
                        // name =
                    }
                    // switch (character) {
                    //     case "Cheerleader":
                    //         name = "Cheerleader";
                    //         break;
                    //     case "Turkey":
                    //         name = "Turkey";
                    //         break;
                    //     default:
                    //         name = nft.title;
                    // }
                    // name = 'test'
                }
            } else {
                name = nft.name ? nft.name : nft.title;
            }
        } else if (nft.metadata) {
            if (nft.metadata.name) {
                name = nft.metadata.name;
                if (nft.metadata.name.indexOf('AR Art Mask') > -1) {
                    name = nft.metadata.name.split('—')[1]
                }
            } else {
                name = nft.name;
            }
        } else if (nft.title) {
            name = nft.title;
            if (nft.title.indexOf('AR Art Mask') > -1) {
                name = nft.title.split('—')[1]
            }
        } else {
            name = nft.name;
        }
    } catch (e) {
        console.log(e);
    }
    return name;
  }

  const getNFTDescription = function (nft) {
    //match by attributes
    let name = nft.description;
    try {
        if (nft.rawMetadata) {
            if (nft.rawMetadata.attributes) {
                // let type = nft.rawMetadata.attributes.find((o) => {
                //     return o.trait_type === "Balloon"
                // });
                let character = nft.rawMetadata.attributes.find((o) => {
                    return o.trait_type === "Character"
                });
                // if (type) {
                //     name = type.value
                // }
                if (nft.title.indexOf('96th Macy’s Thanksgiving Day Parade') > -1) {
                    if (character.value.indexOf('Turkey') > -1) {
                        name = "More gobbles, less squabbles. It’s all gravy for our favorite bird—the de facto star of the Macy’s Thanksgiving Day Parade. "
                    } else if (character.value.indexOf('Clown') > -1) {
                        name = "Story: Send in the clown and step right up to our jolly holiday extravaganza. It’s all fun and games when this festive holiday clown brings his juggling act to the 34th Street scene. "
                    } else if (character.value.indexOf('Cheerleader') > -1) {
                        name = "Story: Shake your pom-poms and cheer for 96 years of Macy’s history. Our spirited Thanksgiving cheerleader brings the pep. Gimme an N! Gimme a Y! Gimme a C! "
                    } else if (character.value.indexOf('Firefighter') > -1) {
                        name = "Story: Shake your pom-poms and cheer for 96 years of Macy’s history. Our spirited Thanksgiving cheerleader brings the pep. Gimme an N! Gimme a Y! Gimme a C! "
                    } else if (character.value.indexOf('Policeman') > -1) {
                        name = "Put on your badge of honor and jump to the beat. This officer is officially on patrol for the Macy’s Thanksgiving Day Parade. "
                    }  else if (character.value.indexOf('Girl') > -1) {
                        name = "Story: Grab your warmest scarf and beanie—and don’t forget your favorite pair of earrings. We’re meeting up with the girls downtown to take in the holiday sights. "
                    }  else if (character.value.indexOf('Guy') > -1) {
                        name = "Story: With his cozy turtleneck and glasses, this stylish guy is pure good vibes. Meet him on 34th Street to get the holiday party started. "
                    } else if (character.value.indexOf('Guitarist') > -1) {
                        name = "Our guitar hero is turning it all the way up to 11—and he’s got a backstage pass to the Macy’s Thanksgiving Day Parade. Rock on, my dude. "
                    } else if (character.value.indexOf('Santa') > -1) {
                        name = "You heard it here first: Santa Claus is coming to town. No need to write him a letter; he’s bringing season’s greetings to 34th Street and heralding the start of the holidays. Lead the sleigh!  "
                    } else if (character.value.indexOf('Elf') > -1) {
                        name = "Story: Good things come in small packages. Our elf has closed up shop in his enchanted workshop and he’s on a mission to bring more holiday magic to the iconic Macy’s Thanksgiving Day Parade. "
                    }else {
                        // name =
                    }
                    // switch (character) {
                    //     case "Cheerleader":
                    //         name = "Cheerleader";
                    //         break;
                    //     case "Turkey":
                    //         name = "Turkey";
                    //         break;
                    //     default:
                    //         name = nft.title;
                    // }
                    // name = 'test'
                }
            } else {
                // name = nft.name ? nft.name : nft.title;
            }
        } else if (nft.metadata) {
            // if (nft.metadata.name) {
            //     name = nft.metadata.name;
            //     if (nft.metadata.name.indexOf('AR Art Mask') > -1) {
            //         name = nft.metadata.name.split('—')[1]
            //     }
            // } else {
            //     name = nft.name;
            // }
        } else if (nft.title) {
            // name = nft.title;
            // if (nft.title.indexOf('AR Art Mask') > -1) {
            //     name = nft.title.split('—')[1]
            // }
        } else {
            // name = nft.name;
        }
    } catch (e) {
        console.log(e);
    }
    return name;
  }

  let keyswap = [
    'zAkXe4ui1WtGY0jkmTee1IrJ3zI1pewx',
    'K3bqMfa3xxKXjSyyX8Sr2Iy7n3OCNfPX',
    'eflQAy0s_v6rAI1q2CiKQZLf69-qN8z-',
    'vAMzsga-DEPYHrECGcrp0EdpgSh-YMcv',
    "ZfRh6v4NvnEdmXTWp0F8xl3Fzmnn1NEp"
  ]

  const getTransfers = function (contractaddress, type, nftId, owners) {
    console.log("NFTPDP: getTransfers ", contractaddress, type, nftId)
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
                console.log(`transactions ${contractaddress} ${nftId}`,  txns)
                console.log('txns', nftId, txns, response['data']['result']['transfers'].map((o)=>{ return Object.assign({token: web3.utils.hexToNumber(o['tokenId'])},o) }), web3.utils.hexToNumber("0x0000000000000000000000000000000000000000000000000000000000000001"));


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
                        console.log('more', response['data']['result']['transfers'])
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

        var config = {
            method: 'get',
            url: `https://${type}.g.alchemy.com/nft/v2/${keyswap[Math.floor(Math.random() * keyswap.length)]}/getOwnersForToken?contractAddress=${contractaddress}&tokenId=${nftId}`,
        };

        axios(config)
            .then(async function (response) {
                resolve(response);
            })
            .catch(function (error) {
                console.log('error', error);
                resolve([]);
            });
    })
  }

  const promiseTranData = function (owners) {
    console.log(NFTData, 'promiseTranData')
    if (Object.keys(NFTData).length > 0) {
        return new Promise(function (resolve, reject) {
            [NFTData].forEach(function (polygonnft, i) {
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



  useEffect(() => {
    let network = "polygon-mainnet";
    if (NFTData.contract.address == '0x449f661c53ae0611a24c2883a910a563a7e42489') {
        network = "eth-mainnet";
    }
    let owners
    getOwnerOfToken(NFTData.contract.address, network, NFTData.tokenId).then(async function (ownerarr) {
      if (ownerarr && ownerarr['data'] && ownerarr['data'].owners.length > 0) {
        owners = ownerarr['data'].owners;

        promiseTranData(owners).then(function (data) {
          setTimeout(function () {
            //console.log("NFTPDP: Got the Data! ", data)
            setTransactions(data);
              try {
                  setAcquired(new Date(data[0].metadata.blockTimestamp).toLocaleDateString('en-US'))
              } catch (e) {
              }

          }, 100)
        });

      }
    });

    console.log("NFTPDP: Getting History and acquired date with")

  }, []);


  return (
    <>
    {NFTData?
    <div className={styles.detailsWrap}>
      <Link href="/my-collections">Back to profile</Link>
      
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {getMedia(NFTData)}
        </div>
        <div className={styles.copyContainer}>
          <p className={styles.category}>
          {(() => {
              let nft = nftBadge.nfts.find(nft => (nft.contractAddress === NFTData.contract.address))
              return (nft.collection !== "")? nft.collection : ""
            })()}
          </p>
          <h2 data-alt={NFTData.title}>
            {getNFTTitle(NFTData)}
            {/*{map_obj.collections[NFTData.title] ? map_obj.collections[NFTData.title] : NFTData.title}*/}
          </h2>
          <p className={styles.owner}>owned by {textEllipsisMid(owner)}</p>
          <div className={styles.buttonsHolder}>
            {nftBadge.nfts.map((nft, index) => {
              if (
                nft.contractAddress === NFTData.contract.address
                ) {
                console.log( 'addresses ', nft.contractAddress, NFTData.contract.address, nft.badges)
                return nft.badges.map((badge, badgeIndex) => {
                  const badgeIcon = nftBadge.badgeIcons.find(
                    (icon) => icon.name === badge
                  );
                  return (
                    <BadgeButton
                      key={badge}
                      badge={badge}
                      badgeIcon={badgeIcon}
                    />
                  );
                });
              }
              return null;
            })}
          </div>
          <p>{NFTData ? getNFTDescription(NFTData) : ""}</p>
          <div className={styles.sendShareButtons}>
            <button
              className={buttonStyles["button-green"]}
              onClick={share}
            >
              Share
            </button>
            {/*<button>Send (coming soon)</button>*/}
          </div>
          <div className={styles.divider}></div>
          <div className={styles.lineDivider}></div>
          <div className={styles.utilityContainer}>
            <h3>Utility</h3>
            <div
              className={styles.plusMinusContainer}
              onClick={handleUtilityToggle}
            >
              {toggleUtility ? (
                <IconMinus></IconMinus>
              ) : (
                <IconPlus></IconPlus>
              )}
            </div>
            {/* {toggleUtility && (
              <div className={styles.utilityContent}>
                {nftBadge.nfts.map((nft, index) => {
                  if (nft.contractAddress === NFTData.contract.address) {
                    // If the id of the current item matches tokenId, render a button for each badge
                    return nft.utility.map((utility, utilityIndex) => {
                      const badgeIcon = nftBadge.badgeIcons.find(
                        (icon) => icon.name === badge
                      );
                      return (
                        <BadgeButton
                          key={badge}
                          badge={badge}
                          badgeIcon={badgeIcon}
                        />
                      );
                    });
                  }
                  return null;
                })}
              </div>
            )} */}
            {toggleUtility &&
              nftBadge.nfts.map((nft, index) => {
                if (
                  nft.contractAddress === NFTData.contract.address
                ) {
                  return nft.utility.map((obj, objIndex) => (
                    <div className={styles.utilityContent}>
                      <p
                        key={`${index}-${objIndex}`}
                        className={styles.utilityType}
                      >
                        {obj.type}
                      </p>
                      <div className={styles.utilityCopy}>
                        {(typeof obj.copy !== "string") && obj.copy.map((line, index) => (
                          <React.Fragment key={index}>
                            <p>{line}</p>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ));
                }
                return null;
              })}
          </div>
          <div className={styles.lineDivider}></div>
          <div className={styles.detailsContainer}>
            <h3>Details</h3>
            <div
              className={styles.plusMinusContainer}
              onClick={handleDetailsToggle}
            >
              {toggleDetails ? (
                <IconMinus></IconMinus>
              ) : (
                <IconPlus></IconPlus>
              )}
            </div>
            {toggleDetails && (
              <div className={styles.detailsContent}>
                <div className={styles.specs} ref={detailref}>
                  <ul>
                    <li
                      className={sitewideStyles.gradientBackground}
                    >
                      <span>Contact Address</span>{" "}
                      {textEllipsisMid(NFTData.contract.address)}
                    </li>
                    <li
                      className={sitewideStyles.gradientBackground}
                    >
                      <span>Token ID</span> {NFTData.tokenId}
                    </li>
                    <li
                      className={sitewideStyles.gradientBackground}
                    >
                      <span>Date Acquired</span>
                      {/*{acquired}---*/}
                      {(() => {
                        if (transactions) {
                          if (transactions[0]) {
                            return acquired
                          } else {
                            return "";
                          }
                        }
                        return null;
                      })()}
                      {/*{JSON.stringify(NFTData)}*/}
                      {/*{NFTData.balance}*/}
                    </li>
                    <li
                      className={sitewideStyles.gradientBackground}
                    >
                      <span>Rarity</span>
                    </li>
                    <li
                      className={sitewideStyles.gradientBackground}
                    >
                      <span>Token Type</span> {NFTData.tokenType}
                    </li>
                    <li
                      className={sitewideStyles.gradientBackground}
                    >
                      <span>Network</span>
                      {NFTData.contract.address !==
                      "0x449f661c53ae0611a24c2883a910a563a7e42489"
                        ? "Polygon"
                        : "Ethereum"}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3>History</h3>
                  {(() => {
                    if (transactions) {
                      return transactions.map(function (
                        e,
                        i
                      ) {
                        if (
                          e.from ===
                          "0x0000000000000000000000000000000000000000"
                        ) {
                          return (
                            <div className={styles.historyItem} key={"t-" + i}>
                              <div className={styles.historyBullet}></div>
                              Minted to {e.to}{" "}
                              {new Date(
                                transactions[0].metadata.blockTimestamp
                              ).toLocaleDateString("en-US")}
                            </div>
                          );
                        } else {
                          return (
                            <div className={styles.historyItem} key={"t-" + i}>
                              <div className={styles.historyBullet}></div>
                              Transfer from{" "}
                              {textEllipsisMid(e.from)} to{" "}
                              {textEllipsisMid(e.to)}{" "}
                              {new Date(
                                transactions[0].metadata.blockTimestamp
                              ).toLocaleDateString("en-US")}
                            </div>
                          );
                        }
                      });
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
          <div className={styles.lineDivider}></div>
        </div>
      </div>
    </div>
    :
    null}
    </>
  )
}