import React, {useState, useEffect} from "react";
import Link from 'next/link';
import styles from '../../pages/mynfts/[walletid]/nftDetail.module.scss';
import buttonStyles from '../../components/shared/Button.module.scss';
import BadgeButton from '../../components/Collections/BadgeButton';
import IconPlus from '../../components/shared/IconPlus';
import IconMinus from "../../components/shared/IconMinus";
import Picture from "../../components/shared/Picture";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";

export default function CoolCatsTrophyPdp({share, showClaimButton, setHasCoolCats}) {
  const [toggleUtility, setToggleUtility] = useState(false);
  const [typeuser, setTypeuser] = useState(null);
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.application.isLoggedIn);
  const profileName = useSelector((state) => state.account.profileName);
  const [showClaim, setShowClaim] = useState(false);
  const [inventory, setInventory] = useState(null);

  const handleUtilityToggle = () => {
    setToggleUtility(!toggleUtility)
  }
  let getData = async (url) => {
    //let url = Config.DATAPROVIDER_TESTENV + Config.DATAPROVIDER_GETPRODUCT_ENDPOINT + ids;
    if (window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('fds') > -1) {
      console.log("DataProvider: Getting data with ... ", url);
    }
    let response;
    try {
      response = await fetch(url, {
        method: 'GET'
      });
      if (response) {
        let data = await response.json();
        if (data) {
          // this.cachedData = data;
          return data;
        } else {
          // console.log("WARNING: No data in the response ", response);
        }
      }
    } catch (error) {
      if (error.message) {
        console.log('ERROR: error in fetching data: ', error.message, error);
      } else {
        console.log('ERROR: error in fetching data: ', error);
      }
    }

  }


  useEffect(() => {
    if (isLoggedIn && profileName) {
      let getCoolCats = () =>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "email": sessionStorage.getItem('m3ident') ? sessionStorage.getItem('m3ident') : sessionStorage.getItem('m3mreturninguser')
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        let url = 'https://web3servicesmcom.herokuapp.com';
        if (window.location.host.indexOf('localhost')> -1) {
          url = 'http://localhost:3005';
        }
        if (window.location.host.indexOf('fds')> -1) {
          url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
        }

        fetch(url+"/users/getuser?fields=username,coolcatsitems,coolcats", requestOptions)
            .then(async response => {
              let body = await response.json()
              console.log('coolcats in figurine',body )
              if (body.coolcats === 'game' || body.coolcats === 'amex' || body.coolcats === 'other') {
                setHasCoolCats(body.coolcatsitems);
              }

            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
      }
      getCoolCats();
    }
  }, [])

  useEffect(() => {
    let type = sessionStorage.getItem('m3typeuser') ? sessionStorage.getItem('m3typeuser') : false;
    let params = new URLSearchParams(window.location.search);
    if (params.get('m3typeuser')) {
      type = params.get('m3typeuser')
    }
    if (params.get('usertype')) {
      type = params.get('usertype');
    }
    let subtype = null;
    if (isLoggedIn && profileName) {
      try {
        let profile = sessionStorage.getItem('mcomProfile') ? JSON.parse(sessionStorage.getItem('mcomProfile')) : {};
        let amexuser = profile.billingMapper.filter((o) => {
          return o.creditcarddetails.cardtype == 'B'
        });
        if (amexuser.length > 0) {
          subtype = "amex";
        }
      } catch(e){}
    }
    if (params.get('claim')) {
      setTypeuser(type);
    }

    let getData = async (url) => {
      //let url = Config.DATAPROVIDER_TESTENV + Config.DATAPROVIDER_GETPRODUCT_ENDPOINT + ids;
      if (window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('fds') > -1) {
        console.log("DataProvider: Getting data with ... ", url);
      }
      let response;
      try {
        response = await fetch(url, {
          method: 'GET'
        });
        if (response) {
          let data = await response.json();
          if (data) {
            // this.cachedData = data;
            return data;
          } else {
            // console.log("WARNING: No data in the response ", response);
          }
        }
      } catch (error) {
        if (error.message) {
          console.log('ERROR: error in fetching data: ', error.message, error);
        } else {
          console.log('ERROR: error in fetching data: ', error);
        }
      }

    }
    (async() => {
      let inventoryjson = "inventory.json"
      if (window.location.host.indexOf('macys.com') > -1 || window.location.host.indexOf('ngrok') > -1) {
        inventoryjson = 'inventory-prod.json';
      }
      let inventoryall = await getData('//storage.googleapis.com/imp-web3/nft/'+inventoryjson);
      setInventory(inventoryall);
      if (subtype) {
        if (inventoryall[subtype] > 0) {
          setShowClaim(true);
        }
      } else {
        if (inventoryall[type] > 0) {
          setShowClaim(true);
        }
      }
    })()
  }, []);

  const handleClaim = () => {

    let params = new URLSearchParams(window.location.search);
    let postdata = async (itemtype, type)=>{
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let items = itemtype.split(',');
      let postbody = {
        "type": type,
        "email": sessionStorage.getItem('m3ident'),
        "coolcatsitems": items
      }
      // if (params.get('claimid') && type === 'other') {
      //   postbody.id = params.get('claimid');
      // }
      var raw = JSON.stringify(postbody);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      let url = "https://web3servicesmcom.herokuapp.com";
      if (window.location.hostname.indexOf('localhost') > -1) {
        url = "http://localhost:3005";
      }
      if (window.location.host.indexOf('fds')> -1) {
        url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
      }

      fetch(url+"/users/inventory/setuser", requestOptions)
          .then(async response =>
              {
                var body = await response.json();
                console.log('/users/inventory/setuser"', body);
                if (!body.message) {
                  return "updated"
                } else {
                  return "error"
                }
              }
          )
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    }
    // check if logged in
    if (isLoggedIn && profileName) {
      // existing user  - logged in - go to suprise if items left

      try {
        let amexuser = [];
        try {
          let profile = sessionStorage.getItem('mcomProfile') ? JSON.parse(sessionStorage.getItem('mcomProfile')) : {};
          amexuser = profile.profileheader.billingMapper.filter((o) => {
            return o.creditcarddetails.cardtype == 'B'
          });
        } catch(e){}
        let fromOnCyber = false;
        if ((window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('fds') > -1) && params.get('fromOnCyber') ) {
          fromOnCyber = true
        }
        if (amexuser.length > 0) {
          if (sessionStorage.getItem('fromOnCyberGame') || fromOnCyber) {
            (async () => {
              // let setdata = await postdata('trophy',"game")
              postdata('trophy',"game").then((result)=>{
                console.log('logged in and go to my physical', result)
                // router.push(`/my-collections/?fromTrophy=true`)
                router.push(`/mynfts/digitalCollectible/figurine/?usertype=${typeuser}&claim=figurine&amexuser=true&surprise=true`)
              })
            })()
            // router.push(`/mynfts/digitalCollectible/figurine/?usertype=${typeuser}&claim=figurine&amexuser=true&surprise=true`)
          } else {
            alert("Sorry you didnt complete the game");
          }
          //take from amex pool
        } else {
          if (inventory['game'] > 0) {


            if (sessionStorage.getItem('fromOnCyberGame') || fromOnCyber) {
              (async () => {
                // let setdata = await postdata('trophy',"game")
                postdata('trophy',"game").then((result)=>{
                  console.log('logged in and go to my physical', result)
                  router.push(`/mynfts/digitalCollectible/figurine/?usertype=${typeuser}&claim=figurine&surprise=true`)
                  // router.push(`/my-collections/?fromTrophy=true`)
                })
              })()
            } else {
              alert("Sorry you didnt complete the game");
            }
          } else {
            //no more game inventory for surprise, award only digital item
            (async () => {
              // let setdata = await postdata('trophy',"game")
              // setdata.then((result)=>{
              //   console.log('logged in and go to my collections', result)
              //   router.push(`/my-collections/?fromTrophy=true`)
              // })
              if (sessionStorage.getItem('fromOnCyberGame') || fromOnCyber) {
                postdata('trophy', "game").then((result) => {
                  console.log('logged in and go to my collections', result)
                  router.push(`/my-collections/?fromTrophy=true`)
                  // router.push(`/my-collections/?fromTrophy=true`)
                })
              } else {
                // router.push(`/my-collections/?fromTrophy=true&didntcomplete`)
              }
            })()

          }

          // take from game pool
        }
      } catch(e){

      }

    } else {
      //not logged in
      let amexuser = false;
      try {
        let profile = sessionStorage.getItem('mcomProfile') ? JSON.parse(sessionStorage.getItem('mcomProfile')) : {};
         amexuser = profile.profileheader.billingMapper.filter((o) => {
          return o.creditcarddetails.cardtype == 'B'
        });
      } catch(e) {

      }
      router.push(`/?usertype=${typeuser}&claim=trophy${params.get('devAmex') ? '&devAmex='+params.get('devAmex') : '' }${params.get('fromOnCyber') ? '&fromOnCyber='+params.get('fromOnCyber') : '' }${amexuser ? '&amexuser=true' : '' }`);

    }

  }

  useEffect(() => {
    
  }, []);

  return (
    <>
    <div className={styles.detailsWrap}>
      {typeuser === 'amex' || typeuser === 'game' || typeuser === 'other' ?
          null :
          isLoggedIn ? <Link href="/my-collections">Back to profile</Link> : <Link href={"/"}>Back</Link>
      }
      <div className={styles.content}>
          <div className={`${styles.imageBorderGradient} ${styles.contentLeft}`}>
          <div className={styles.imageContainerCollectibles}>
            <img src="https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcatstrophy.jpg" />
          </div>
        </div>
        <div className={styles.copyContainer}>
          <p className={styles.category}>Macy's Digital Collectibles</p>
          <h2>Macy's Thanksgiving Day Parade<sup>&reg;</sup><br />Digital Art Trophy</h2>
          {typeuser === 'amex' || typeuser === 'game' || typeuser === 'other' ?
              null :
              isLoggedIn ? <p className={styles.owner}>Owned by you</p> : null
          }
          <div className={styles.buttonsHolder}>
            <BadgeButton
              key={"digitItem"}
              badge={"Digital Item"}
              badgeIcon={{imgName:'nft-badge-icon-digital-item-updated',width:15,height:17}}
            />
           
          </div>


          {typeuser === 'amex' || typeuser === 'game' || typeuser === 'other' ?
            <>
              <p>
              To celebrate our first-ever NFT balloon collaboration with Cool Cats, we’ve created a dynamic digital trophy that will transform into a digital masterpiece.
              </p>

              <div className={styles.sendShareButtons}>
                <button
                  className={buttonStyles["button-green"]}
                  onClick={handleClaim}
                >
                  Claim Trophy
                </button>
              </div>
              <div className={styles.legal}>By continuing, you agree that you are subject to Macy’s <a href={"https://customerservice-macys.com/articles/highlights-of-macys-inc-notice-of-privacy-practices"}>Notice of Privacy Practices</a> and <Link href={"/paradegameterms"}>Terms of Service</Link>.</div>
            </>
            :
            <>
              <p>
              To celebrate our first-ever NFT balloon collaboration with Cool Cats, we’ve created a dynamic digital trophy that will transform into a digital masterpiece.
              </p>

              <div className={styles.sendShareButtons}>


                {!showClaim ?
                /*<button data-noshowclaim
                  className={buttonStyles["button-green"]}
                  onClick={handleClaim}
                >
                  Share
                </button>*/
                null
                :
                (typeuser === "game" || typeuser === "amex" || typeuser === "other") ?
                <div data-showclaimusert>
                  <br/>
                  <button className={`${buttonStyles["button-green"]} ${buttonStyles["disabled"]}`}>Claim Now</button>
                  <p className={styles.error}>Sorry, this item is currently out of stock.</p>
                </div>
                    :
                    <div data-showclaimshare><div className={styles.sendShareButtons}>
                      {/*<<button
                          className={buttonStyles["button-green"]}
                          onClick={share}
                      >
                        Share
                        </button>*/}
                    </div>
                </div>
            }

              </div>
            </>}
          <div className={styles.utilityWrapper}>
            <div className={styles.lineDivider}></div>
            {/*UTILITY*/}
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
              {toggleUtility &&
                <div className={styles.utilityContent}>
                  <p
                    className={styles.utilityType}
                  >Digital</p>
                  <p className={styles.utilityCopy}>
                    Update dynamic digital trophy’s appearance – mid 2024.
                  </p>
                  <p
                    className={styles.utilityType}
                  >Experiential</p>
                  <p className={styles.utilityCopy}>
                    Recognition for completing the Macy’s Thanksgiving Day Parade Game.
                  </p>
                </div>}
            </div>
            <div className={styles.lineDivider}></div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.coolcatsSectionTrophy}>
        <div className={styles.inner}>
          <img id={styles.cloud1} src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/clouds.png'}/>
          <img id={styles.cloud2} src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/clouds.png'}/>
          <img id={styles.cloud3} src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/clouds.png'}/>
          <div className={styles.coolcatsContent}>
            <div className={styles.stickerContainer}>
              <Picture desktop="coolcats/sticker.png"/>
            </div>
            <p className={styles.subtitle}>Digital Art Trophy Evolution</p>
            <h2>Color Me Cool</h2>
            <p className={styles.trophyCopy}>Evolve your digital trophy into a masterpiece <br className={styles.desktop} /> from Color Me Cool figurine artist submissions.</p>
            <div className={styles.trophyImage}>
              <img src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/ColorMeCool.png'}/>
            </div>
            
          </div>
        </div>
    </div>
    </>
  )
}