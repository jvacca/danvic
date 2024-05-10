import React, {useState, useEffect} from "react";
import Link from 'next/link';
import styles from '../../pages/mynfts/[walletid]/nftDetail.module.scss';
import buttonStyles from '../../components/shared/Button.module.scss';
import BadgeButton from '../../components/Collections/BadgeButton';
import IconPlus from '../../components/shared/IconPlus';
import IconMinus from "../../components/shared/IconMinus";
import ConfettiSvg from "../../../src/assets/svg/confetti.svg";

import { useRouter, usePathname, useSearchParams  } from "next/navigation";
// import {useSelector} from "react-redux";
import Steps from "../../components/Parade/Steps";
import stepStyles from '../../components/Parade/Steps.module.scss';
import sitewideStyles from "../../styles/sitewide.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setOpenParadeGameModal } from '../../reducers/ApplicationSlice';
import ParadeGameModal from "../Parade/ParadeGameModal";

export default function CoolCatsFigurinePdp({share, showSpecialReward, showParadeGameBanner, showClaimButton, setHasCoolCats}) {
  const [toggleUtility, setToggleUtility] = useState(false);
  const dispatch = useDispatch();
  const [claimedAlready, setClaimedAlready] = useState(false);
  const [claimedAlready2, setClaimedAlready2] = useState(false);
  const [error, setError] = useState(false);
  const [showGameBanner, setShowGameBanner] = useState(true);
  // const [showTrophyItem, setShowTrophyItem] = useState(false);
  const [paradeLive, setParadeLive] = useState(false);

  const stepsData = [
    {
      title: "Unleash your inner artist",
      copy: "Color, draw, or paint on the item to craft your unique Color Me Cool figurine into a <span style='white-space:nowrap;'>one-of-a-kind</span> design.",
      image: "coolcats/step1_image.png",
      link: "#"
    },
    {
      title: "Digitize your design",
      copy: "Tap the figurine’s NFC chip with your smartphone to digitize your design.",
      image: "coolcats/step2_image.png",
      link: "#"
    },
    {
      title: "Share your <span style='white-space:nowrap;'>masterpiece&#9996;<span>",
      copy: "It’s your opportunity to be a featured artist for the Macy’s Thanksgiving Day Parade<sup>®</sup> Digital Art Trophy collection. More details to come in 2024!",
      image: "coolcats/step3_image.png",
      link: "#"
    }
  ]

  const openParadeGameModal = useSelector((state) => state.application.openParadeGameModal);
  const [typeuser, setTypeuser] = useState(null);
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const [inventory, setInventory] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [showClaim1, setShowClaim1] = useState(false);
  const [devOOS, setDevOOS] = useState(false);
  const isLoggedIn = useSelector((state) => state.application.isLoggedIn);
  const profileName = useSelector((state) => state.account.profileName);

  const handleUtilityToggle = () => {
    setToggleUtility(!toggleUtility)
  }

  // let inventorycheck = (type) => {
  //   if (inventory) {
  //     return inventory[type] > 0;
  //   }
  // }

  let claim = ()=>{
      console.log('claim', typeuser);
    // &signedin=${typeuser}
      // send user to landing for signin and onboarding
    let params = new URLSearchParams(window.location.search);

      //if from suprise and delight go to order page since already logged in
    if (isLoggedIn && profileName) {
      if (typeuser === 'game') {
        //game user
        router.push(`/order/?usertype=${typeuser}&claim=figurine${params.get('devAmex') ? '&devAmex=' + params.get('devAmex') : ''}${params.get('amexuser') ? "&amexuser=true" : ""}`);
      } else if (typeuser === 'amex') {
        let amex = false

        if (sessionStorage.getItem('m3typeuser')) {
          try {
            amex = sessionStorage.getItem('m3typeuser') === 'amex';
          }catch(e){}
        }
        try {
          let p = JSON.parse(sessionStorage.getItem('mcomProfile'));
          let amexuser = p.profileheader.billingMapper.filter((o)=>{
            return o.creditcarddetails.cardtype == 'B'
            // && o.creditcarddetails.expirationyear >= 2023
          });
          if (amexuser.length > 0) {
            amex = true;
          }
        } catch(e){

        }
        if (amex) {
          router.push(`/order/?usertype=${typeuser}&claim=figurine${params.get('devAmex') ? '&devAmex=' + params.get('devAmex') : ''}${params.get('amexuser') ? "&amexuser=true" : ""}`);
        } else {
          console.log('sorry not logged in amex!!!!')
          setShowClaim(false);
          setError("Not Amex")
        }
      } else {
        //other
        router.push(`/order/?usertype=${typeuser}&claim=figurine${params.get('devAmex') ? '&devAmex=' + params.get('devAmex') : ''}${params.get('amexuser') ? "&amexuser=true" : ""}${params.get('claimid') ? "&claimid="+params.get('claimid') : ""}`);

      }
    } else {
      //direct from amex email?
      router.push(`/?usertype=${typeuser}&claim=figurine${params.get('devAmex') ? '&devAmex=' + params.get('devAmex') : ''}${params.get('amexuser') ? "&amexuser=true" : ""}${params.get('claimid') ? "&claimid="+params.get('claimid') : ""}`);
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
                setClaimedAlready(true);
                setClaimedAlready2(true);
                setDevOOS(true);
                console.log('alreadyClaimed', claimedAlready2, claimedAlready);
                setHasCoolCats(body.coolcatsitems); //send to parent component coolcats
              }
              // if (body.coolcatsitems.indexOf('trophy') > -1) {
              //   setShowTrophyItem(true);
              // }
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
      }
      getCoolCats();
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://imp-prod.macys.com/api/v1/Actions/getCurrentDateAndTime", {})
      .then(async response => {
        let body = await response.json();
        let params = new URLSearchParams(window.location.search);
        if (body.result) {
          //test start
          // let start = new Date('Thursday, November 13, 2023 8:30:00 AM GMT-05:00').getTime();
          //real start time
          let start = new Date('Thursday, November 23, 2023 8:30:00 AM GMT-05:00').getTime();
          let current = new Date(parseFloat(body.result.responseCurrentTime));
          // console.log('time', body.result.responseCurrentTime, current, start, current > start);
          if (current > start || params.get('live') == 'true') {
            setParadeLive(true);
          }
        } else {
          //do nothing
        }
      })
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }, [])


  //show hide parade banner based on whether they've played
  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    if (sessionStorage.getItem('fromOnCyberGame') || params.get('fromOnCyber')) {
      setShowGameBanner(false)
    }
  }, []);


  useEffect(() => {
    let type = sessionStorage.getItem('m3typeuser') ? sessionStorage.getItem('m3typeuser') : false;
    let params = new URLSearchParams(window.location.search);
    if (params.get('m3typeuser')) {
      type = params.get('m3typeuser')
    }
    if (params.get('usertype')) {
      type = params.get('usertype');
    }
    if (params.get('claim') === 'colormecool' || params.get('claim') === 'figurine') {
      setTypeuser(type);
    }
  }, []);

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
          return data;
        } else {
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

  const onCloseParadeGameModal = (e) => {
    e.stopPropagation();
    dispatch(setOpenParadeGameModal(false));
  }

  useEffect( () => {
    if (!inventory) {

      // async*()
      (async() => {
        let inventoryjson = "inventory.json"
        if (window.location.host.indexOf('macys.com') > -1 || window.location.host.indexOf('ngrok') > -1) {
          inventoryjson = 'inventory-prod.json';
        }
        let inventoryall = await getData('//storage.googleapis.com/imp-web3/nft/'+inventoryjson);
        setInventory(inventoryall);
        try {

          window.inventoryall = inventoryall;
        } catch(e){}
        const claimtype = searchParams.get('claimtype');
        console.log({
          'inventory': inventory,
          pathname: pathname,
          searchParams: searchParams,
          claimtype: claimtype,
          "inventoryall": inventoryall
        });
        searchParams.forEach((k,v)=>{
          if (v === 'claim') {
            if (k === 'colormecool' || k === 'figurine') {
              setShowClaim1(true)
            }
          }
          if (v.toUpperCase() === 'OOS') {
            setDevOOS(true);
          }
          console.log(k,v, 'kv');
        })
      })()
    }

    let params = new URLSearchParams(window.location.search);
    let url = "https://web3servicesmcom.herokuapp.com";
    if (window.location.hostname.indexOf('localhost') > -1) {
      url = "http://localhost:3005";
    }
    if (window.location.host.indexOf('fds')> -1) {
      url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
    }
    if (params.get('claimid')) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var getidOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          "id": params.get('claimid'),
          "type": params.get('usertype')
        }),
        redirect: 'follow'
      };

      fetch(url+"/users/inventory/getid", getidOptions)
          .then(async response =>
          {
            var body = await response.json();
            if (body.claimed) {
              if (body.claimed === 'available') {

              } else {
                console.log('physical already claimed')
                setDevOOS(true)
              }
            } else {
              if (body.message === 'expired') {
                setError('Link expired')
              }
              console.log('error')
              setDevOOS(true)

            }
          }).catch(error => {
        console.log('error', error)
      });
    }

  }, []);

  useEffect( () => {
    let type = sessionStorage.getItem('m3typeuser') ? sessionStorage.getItem('m3typeuser') : false;
    let params = new URLSearchParams(window.location.search);
    if (params.get('m3typeuser')) {
      type = params.get('m3typeuser')
    }
    if (params.get('usertype')) {
      type = params.get('usertype');
    }
    try {
      if (inventory) {
        if (inventory[type]) {
          if (inventory[type] > 0) {
            console.log('showClaim: invetoiry exists')
            setShowClaim(true);
            setShowClaim1(true);

          } else {

          }
        }
        if (params.get('usertype') === 'game') {
          if (params.get('amexuser') === 'true' && sessionStorage.getItem('m3typeuser') === 'amex') {
            console.log('showClaim: coming from game but make it amex------', inventory, params.get('amexuser'), sessionStorage.getItem('m3typeuser'))
            if (inventory['amex'] > 0) {
              setShowClaim(true);
              setShowClaim1(true);
            }
          }
        }
      } else {
        console.log('showClaim: inventory never set', inventory)
      }
    } catch(e){
      console.log('showClaim errr', e);
    }
    if (type === 'other' && params.get('claimid')) {
      console.log('showClaim other');
      setShowClaim(true);
      setShowClaim1(true);
    }
    if (claimedAlready) {
      console.log('showClaim already claimed');
      setClaimedAlready2(claimedAlready)
    }
    console.log('showClaim1',inventory, type, showClaim, showClaim1, claimedAlready, sessionStorage.getItem('m3typeuser'));
  },[inventory])


  useEffect(()=>{
    try {
      if (typeuser === 'game') {
        let confetti = window.confetti || function(){};
        confetti();
      }
    }catch (e){}
  }, [])
  return (
    <>
      {/*check if game and has inventory*/}
      {typeuser === 'game' && showClaim1 ? 
          <div className={styles.specialReward} style={{backgroundImage: `url(${ConfettiSvg})`}}>
            <h2>Surprise 🎉</h2>
        <p>As one of the first users to finish the game, we’re rewarding<br className={sitewideStyles.desktopOnly} />
            you with a chance to claim a Color Me Cool Figurine. <br className={sitewideStyles.desktopOnly}/>
            Don’t miss out—the offer ends in five minutes.</p>
            <img id={styles.cloud4} src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/clouds.png'}/>
          </div> 
      :
      null
      }


      {/*removing banner only on game surprise*/}
    {/*{typeuser === 'amex' && showClaim1 && <div className={styles.specialReward}>*/}
    {/*  <h2 data-type={typeuser}>Special reward! 🎉</h2>*/}
    {/*  <p>As a perk for being a Macy’s American Express® Cardholder,* you can claim a Color Me Cool Figurine.<br/>Don’t miss out—the offer ends in five minutes.</p>*/}
    {/*  <img id={styles.cloud4} src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/clouds.png'}/>*/}
    {/*</div>}*/}


    <div className={styles.detailsWrap}>
      {!showClaim1 ?
      <Link href="/my-collections">Back to profile</Link>
          : null
      }
      <div className={styles.content}>
        <div className={`${styles.imageBorderGradient} ${styles.contentLeft}`}>
          <div className={styles.imageContainerCollectibles}>
            <img src="https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcatsfigurine.jpg" />
            <img id={styles.sticker2} src="https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/sticker2.png" />
          </div>
        </div>
        <div className={styles.copyContainer}>
          <p className={styles.category}>Macy's Digital Collectibles</p>
          <h2>Color Me Cool <br /> Commemorative Parade Figurine</h2>
          {/*{typeuser === 'amex' || typeuser === 'game' || typeuser === 'other' ?*/}
          {/*    null :*/}
          {/*    <p className={styles.owner}>{isLoggedIn ? 'Owned by you' : ''}</p>*/}

          {/*}*/}

          <div className={styles.buttonsHolder}>
            <BadgeButton
              key={"digitItem"}
              badge={"Digital Item"}
              badgeIcon={{imgName:'nft-badge-icon-digital-item-updated',width:22,height:16}}
            />
           <BadgeButton
              key={"physicalItem"}
              badge={"Physical Item"}
              badgeIcon={{imgName:'nft-badge-icon-physical-item',width:15,height:17}}
            />
            <BadgeButton
              key={"digitalTwin"}
              badge={"Digital Twin"}
              badgeIcon={{imgName:'nft-badge-icon-digital-twin2',width:21,height:17}}
            />
            <BadgeButton
              key={"3Dasset"}
              badge={"3D Asset"}
              badgeIcon={{imgName:'nft-badge-icon-3d-asset',width:14,height:16}}
            />
            <BadgeButton
              key={"unlocksAccess"}
              badge={"Unlocks Access"}
              badgeIcon={{imgName:'nft-badge-icon-unlocks-access',width:18,height:8}}
            />
          </div>
        {(typeuser === 'amex' || typeuser === 'game' || typeuser === 'other') && showClaim1 ?
          <>

            <p>
            In celebration of Cool Cats characters, Blue Cat & Chugs, becoming the first-ever NFT balloon to take flight in this year’s Macy’s Thanksgiving Day Parade<sup>®</sup>, we’re giving you a chance to claim this Color Me Cool Commemorative Parade Figurine.
            <br/> <br/>
            You’ll be able to decorate it & digitize your new design by scanning an embedded NFC chip. Then share your masterpiece for an opportunity to be a featured artist for the Macy’s Thanksgiving Day Parade<sup>®</sup> Digital Art Trophy collection.
            </p>

            {/*<div className={styles.sendShareButtons}>*/}
            {/*  <button*/}
            {/*    className={buttonStyles["button-green"]}*/}
            {/*    onClick={share}*/}
            {/*  >*/}
            {/*    Claim Now*/}
            {/*  </button>*/}
            {/*</div>*/}

                <div className={styles.contbuttons}>
                  {showClaim && !devOOS && !claimedAlready && !claimedAlready2?
                    <div className={styles.claim} data-claim={claimedAlready} data-claim2={claimedAlready2}>
                      <button
                        className={`${buttonStyles["button-green"]} ${buttonStyles["button-long"]}`}
                        onClick={claim}
                      >
                        Claim Figurine (US Only)
                      </button>
                      {/*skip only for game users*/}
                      {typeuser === 'game' ?
                        <Link href={'/my-collections?fromFigurine=skip'}><button>Skip</button></Link>
                          : null
                      }
                    </div> :

                    <>
                    <div className={styles.claim}>
                      <br/>
                      <button className={`${buttonStyles["button-green"]} ${buttonStyles["button-disabled"]}`}>
                        {claimedAlready2 ? "Already Claimed" : "Claim Figurine (US Only)"}</button>
                    </div>
                      <p className={`${styles.error} ${styles.claimerror}`}>
                        {error ? error : "Sorry, this item is currently out of stock."}
                      </p>
                    </>
                    }
                    <div className={styles.legal}>By continuing, you agree that you are subject to Macy’s <a href={"https://customerservice-macys.com/articles/highlights-of-macys-inc-notice-of-privacy-practices"}>Notice of Privacy Practices</a> and <Link href={"/paradegameterms"}>Terms of Service</Link>.</div>
                </div>
            {/*<Link href="/paradegameterms">Terms of service</Link>*/}

          </>
          :
          <>
            <p>
            In celebration of Cool Cats characters, Blue Cat & Chugs, becoming the first-ever NFT balloon to take flight in this year’s Macy’s Thanksgiving Day Parade<sup>®</sup>, we’re giving you a chance to claim this Color Me Cool Commemorative Parade Figurine.
            <br/> <br/>
            You’ll be able to decorate it & digitize your new design by scanning an embedded NFC chip. Then share your masterpiece for an opportunity to be a featured artist for the Macy’s Thanksgiving Day Parade<sup>®</sup> Digital Art Trophy collection.
            </p>
            {/*<div className={styles.sendShareButtons}>*/}
            {/*  <button*/}
            {/*      className={buttonStyles["button-green"]}*/}
            {/*      onClick={share}*/}
            {/*  >*/}
            {/*    Share*/}
            {/*  </button>*/}
            {/*</div>*/}
            </>
          }

          {/*//share*/}



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
                    <ul>
                      <li>Limited quantity collectible item.</li>
                      <li>Digital twin of the physical connected figurine.</li>
                      <li>3D assets available for download.</li>
                      <li>Update the digital twin’s appearance – mid 2024</li>
                    </ul>
                  </p>
                  <p
                    className={styles.utilityType}
                  >Physical</p>
                  <p className={styles.utilityCopy}>
                    <ul>
                      <li>Exclusive physical connected figurine.</li>
                      <li>Equipped with embedded near-field communication (NFC) chip.</li>
                    </ul>
                  </p>
                  <p
                    className={styles.utilityType}
                  >Experiential</p>
                  <p className={styles.utilityCopy}>
                    <ul>
                      <li>Unlock the ability to submit your creation for opportunity to become art NFT.</li>
                      <li>Recognition for select designs, which will be immortalized as art NFTs.</li>
                    </ul>
                  </p>
                  <p
                    className={styles.utilityType}
                  >How to use it</p>
                  <p className={styles.utilityCopy}>
                    <ul>
                      <li>Craft your unique design on the blank figurine.</li>
                      <li>Scan the integrated NFC chip in the star to submit your design and claim your digital art collectible.</li>
                      <li>Share your design with the Parade Game Trophy Community; the top 10 designs will become Dynamic Art NFTs.</li>
                    </ul>
                  </p>
                </div>}
            </div>
            <div className={styles.lineDivider}></div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.coolcatsSection}>
      <Steps stepsData={stepsData} isPDP={true}className={stepStyles.coolCatsSteps}/>
      <img id={styles.pawprints2} className={sitewideStyles.desktopOnly} src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/pawprints.png'}/>
    </div>
    {/* {showParadeGameBanner &&  */}
      {!showGameBanner ? null :
          <div className={styles.paradeGameBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.copy}>
            <div className={styles.inner}>
              <p>
                Join us to play the Macy’s <br className={sitewideStyles.mobileOnly}/>Thanksgiving Day
              </p>
              <h2>Parade Game</h2>
              <p>
                Jump into the virtual Parade, play the game & get a chance to claim something cool.
              </p>
                <a onClick={() => {
                  if (paradeLive) {
                    dispatch(setOpenParadeGameModal(true))
                  } else {
                    //do nothing
                  }
                }} className={`${buttonStyles["button-green"]} ${paradeLive ? "" : styles['disabled-link']}`}>Let's Play Now</a>
            </div>
          </div><div className={styles.image}>
          <img src='https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcats/paradeGame.png' />
        </div>
        </div>
      </div>
      }

      {/*{showTrophyItem ? null : null}*/}

    {/* } */}
      <ParadeGameModal onCloseModal={onCloseParadeGameModal} showModal={openParadeGameModal} />
    </>
  )
}