import React, {useState, useEffect, useRef} from "react";
import Link from 'next/link';
import DataProvider from "../../utils/DataProvider";
import styles from '../../pages/mynfts/[walletid]/nftDetail.module.scss';
import buttonStyles from '../../components/shared/Button.module.scss';
import BadgeButton from '../../components/Collections/BadgeButton';
import DigitalItem from "../../components/Collections/DigitalItem";
import IconPlus from '../../components/shared/IconPlus';
import IconMinus from "../../components/shared/IconMinus";
import IconLogo from "../../assets/svg/icon-logo.svg";
import {usePathname, useRouter, useSearchParams} from "next/navigation";


export default function NFTPdp({token, share}) {
  const [attributes, setAttributes] = useState({});
  const [toggleUtility, setToggleUtility] = useState(false);
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();

  const handleUtilityToggle = () => {
    setToggleUtility(!toggleUtility)
  }

  const editname = () => {
    // if (window.location.host.indexOf('localhost') > -1) {
        console.log('onboarding', router, pathname)
        sessionStorage.setItem('editingclaim', true);
        let parms = pathname.split('/').filter((o)=>{return o});
        let uname = parms[parms.length-1];
        let name = sessionStorage.getItem("profileName") ? sessionStorage.getItem("profileName") : uname;
        router.push('/?name='+name)
        // try {
        //     let pathp = window.location.pathname.indexOf('/social/mstylelab') > -1 ? '/social/mstylelab' : '/social/1';
        //     window.location.href = window.location.origin + pathp + '?name='+sessionStorage.getItem("profileName");
        // } catch(e){
        //
        // }
    // }
  }

  useEffect(() => {
    (async () => {
      let url = 'https://web3servicesmcom.herokuapp.com';
      if (window.location.host.indexOf('localhost') > -1) {
          url = 'http://localhost:3005';
      }
        if (window.location.host.indexOf('fds')> -1) {
            url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
        }

        if (token) {
          let getAttr = await DataProvider.getData(`${url}/users/usernameattr?username=${token}`);
          console.log('getAttr', getAttr);
          setAttributes(getAttr);
      }
    })();
    console.log('NFTDetails: digital fashion item pdp', token, attributes);
  }, []);

  return (
    <div className={styles.detailsWrap}>
      <Link href="/my-collections">Back to profile</Link>
      <div className={styles.content}>
        <div className={styles.imageBorderGradient}>
          <div className={styles.imageContainer} id={styles['username-frame']}>
              <DigitalItem id={sessionStorage.getItem('profileName')||token} attributes={attributes}/>
          </div>
        </div>
        <div className={styles.copyContainer}>
          <p className={styles.category}><IconLogo /></p>
          <h2>Mstylelab Digital Fashion</h2>
          <p className={styles.owner}>Owned by {sessionStorage.getItem('profileName') === token? 'you' : token}</p>
          <div className={styles.buttonsHolder}>
            <BadgeButton
              key={"digitItem"}
              badge={"Digital Item"}
              badgeIcon={{imgName:'nft-badge-icon-digital-item2',width:15,height:17}}
            />
            {/*<BadgeButton*/}
            {/*  key={"rpm"}*/}
            {/*  badge={"Ready Player Me"}*/}
            {/*  badgeIcon={{imgName:'nft-badge-icon-rpm',width:15,height:17}}*/}
            {/*/>*/}
          </div>
          <p>
          Thank you for joining us on our first journey. Your digital fabric has now evolved into a digital wearable.<br/><br/>Stay tuned for notifications—we’ll let you know when your shirt is here, plus how to try it on when it’s ready.
          </p>

          {/*//share*/}
          <div className={styles.sendShareButtons}>
            <button
              className={buttonStyles["button-green"]}
              onClick={share}
            >
              Share
            </button>
          </div>
          <div><button className={styles.editBtnComingSoon} onClick={editname}>Avatar Try On (Coming Soon)</button></div>
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
                ></p>
                <p className={styles.utilityCopy}>
                  Materializing soon.
                </p>
              </div>}
          </div>
          <div className={styles.lineDivider}></div>
        </div>
      </div>
    </div>
  )
}