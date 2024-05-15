/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams  } from "next/navigation";
import {
  updateAccount,
  updateUserId,
  updateMcomProfile,
  updateProfileName,
  updateDefaultWallet,
  updateWalletStatus,
  updateNotifications,
  updateSubscribeNewsletter,
  updateProfileData,
} from "../reducers/AccountSlice";
import {
  updateIsLoggedIn,
  updateIsReturningUser,
  setOpenModal,
} from "../reducers/ApplicationSlice";
import {
  updateMagicMetadata,
  updateIsMagicLoggedIn,
} from "../reducers/MagicSlice";
import useWalletStateSync from "../hooks/useWalletStateSync";
import MacysAuth from "../utils/MacysAuth";
//import WalletLibrary from "../web3/WalletLibrary";
import Signin from "./Signin/Signin";
import HeaderLogo from "../assets/svg/header-logo.svg";
import IconProfile from "../assets/svg/icon-profile.svg";
import IconProfileOn from "../assets/svg/icon-profile-on.svg";
import IconLogo from "../assets/svg/icon-logo.svg";
import IconHamburger from "../assets/svg/icon-hamburger.svg";
import IconHamburgerOn from "../assets/svg/icon-hamburger-on.svg";
//import Image from './shared/Image';
import styles from "./Header.module.scss";
import HeaderModalMenu from "./HeaderModalMenu";
import useAsyncLoad from "../hooks/useAsyncLoad";
import DataProvider from "../utils/DataProvider";
import Script from "next/script"
//socketio
// import {io} from 'socket.io-client';
// import {zsocket} from '../hooks/socketio';

const { Magic } = require("magic-sdk");

let magicauth = null;
if (typeof window !== "undefined") {
  magicauth = new Magic("pk_live_B2FB59D85E2D18C0", {
    network: "polygon",
  });
}

/*
  Module responsibilities: 
  set modal state to show or close
  set profile icon state
  set dropdown menu to show or close
*/

export default function Header() {
  const [modalState, setModalState] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileRollover, setProfileRollover] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [hamburgerRollover, setHamburgerRollover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItemActive = useSelector((state) => state.application.navItemActive);
  const userId = useSelector((state) => state.account.userId);
  const mcomProfile = useSelector((state) => state.account.mcomProfile);
  const account = useSelector((state) => state.account.currentAccount);
  const profileName = useSelector((state) => state.account.profileName);
  const subscribeNewsletter = useSelector(
    (state) => state.account.subscribeNewsletter
  );
  const defaultWallet = useSelector((state) => state.account.defaultWallet);
  const isReturningUser = useSelector(
    (state) => state.application.isReturningUser
  );
  const isLoggedIn = useSelector((state) => state.application.isLoggedIn);
  const openModal = useSelector((state) => state.application.openModal);

  const dispatch = useDispatch();
  const router = useRouter();
  const loadUserData = useAsyncLoad();
  const { loadWalletDataToStates } = useWalletStateSync();
  const pathname = usePathname()
  const searchParams = useSearchParams();

  const updateViewport = () => {
    setIsMobile(window.innerWidth <= 751);
  };

  useEffect(() => {
    const pageview = () => {
      console.log('pageview', pathname);
      try {
          let AdobeTracker = window.AdobeTracker || {};
          let utag = window.utag || {};
          var path = window.location.pathname.split('/').filter((o)=>{return o}).join(':')
          try {
              utag.data.adobe_page_name = "mcom:" + path;
              AdobeTracker.trackPage(utag.data.adobe_page_name)
          } catch(e){
            // console.log(e, 'pageview');
            setTimeout(pageview, 500);
          }
      } catch(e){}
    }
    setTimeout(()=>{
      pageview();
    },300)
    // console.log('router', pathname, searchParams)
  }, [pathname, searchParams]);

  // this part should only run once when the component is loaded such as on page load or refresh
  useEffect(() => {

    // fix for undefined profileName
      if (sessionStorage.getItem('profileName')) {
        if (sessionStorage.getItem('profileName') === 'undefined') {
          sessionStorage.removeItem('profileName')
        }
      }




      // socket.on('publish message', async(msg) => {
      //     console.log(msg, 'publish')
      //
      //     alert('user notification!')
      //     // setItems(msg)
      //     // if (sessionStorage.getItem('m3ids')) {
      //     //     setItems(await getUserMsg(sessionStorage.getItem('m3ids')))
      //     // }
      // })
      // socket.on('delete message', async(msg) => {
      //     console.log(msg, 'delete')
      //     if (sessionStorage.getItem('m3ids')) {
      //         setItems(await getUserMsg(sessionStorage.getItem('m3ids')))
      //     }
      // })

      // socket.on("session", ({sessionID, userID}) => {
      //     console.log("SEESSSSION-----", sessionID, userID, socket)
      //     // attach the session ID to the next reconnection attempts
      //     socket.auth = {sessionID};
      //     // store it in the localStorage
      //     localStorage.setItem("sessionID", sessionID);
      //     // save the ID of the user
      //     socket.userID = userID;
      // });

      updateViewport(); // Initial check
      window.addEventListener("resize", updateViewport);

    console.log("Header: detecting login persistence and wallet connections ");


    if (!profileName) {
      try {
        if (sessionStorage.getItem("profileName")) {
          console.log(
            profileName,
            "profileName",
            sessionStorage.getItem("profileName")
          );
          dispatch(
            updateProfileName(
              sessionStorage.getItem("profileName"),
              profileName
            )
          );
        }
      } catch (e) {}
    }

    if (!isLoggedIn) {
      try {
        if (localStorage.getItem('m3keep')) {
          if (!profileName || !sessionStorage.getItem("profileName")) {
            try {
              let lx = JSON.parse(localStorage.getItem('m3keep'));
              if ( lx.profileName ) {
                sessionStorage.setItem("profileName", lx.profileName)
                dispatch(updateProfileName(lx.profileName));
              }
              if (lx.email) {
                sessionStorage.setItem("m3ident", lx.email);
                sessionStorage.setItem("m3ids", lx.email);
                dispatch(updateSubscribeNewsletter(lx.notifications_email));
              }

              if (lx.notifications) {
                dispatch(updateNotifications(lx.notifications));
              }
              if (lx.default_wallet) {
                dispatch(updateDefaultWallet(lx.default_wallet));
              }
              if (lx.profileName) {
                dispatch(updateProfileData(lx));
                dispatch(updateIsLoggedIn(true));
              }

              console.log('keep me signed in ',lx)
            } catch(e){}
          }
        }

        if (
          sessionStorage.getItem("m3maccount") &&
          document.cookie.indexOf("macys_online_guid") > -1
        ) { // auth cookie and magic auth wallet
          // if we have magicauth session storage and Macy's account cookie
          // load the user settings from db

          if (localStorage.getItem('m3keep')) {
            if (!profileName && !sessionStorage.getItem("profileName")) {
              try {
                let lx = JSON.parse(localStorage.getItem('m3keep'));
                if ( lx.profileName ) {
                  sessionStorage.setItem("profileName", lx.profileName)
                  dispatch(updateProfileName(lx.profileName));
                }
                if (lx.email) {
                  sessionStorage.setItem("m3ident", lx.email);
                  sessionStorage.setItem("m3ids", lx.email);
                  dispatch(updateSubscribeNewsletter(lx.notifications_email));
                }

                if (lx.notifications) {
                  dispatch(updateNotifications(lx.notifications));
                }
                if (lx.default_wallet) {
                  dispatch(updateDefaultWallet(lx.default_wallet));
                }
                if (lx.profileName) {
                  dispatch(updateProfileData(lx));
                  dispatch(updateIsLoggedIn(true));
                }

                console.log('keep me signed in ',lx)
              } catch(e){}
            }
          }

          const userid = sessionStorage.getItem("m3ids");
          const mcomProfile = JSON.parse(sessionStorage.getItem("mcomProfile"));
          const magicMetadata = JSON.parse(
            sessionStorage.getItem("m3maccount")
          );

          loadUserData("/users/getusersettings", [userid]).then((data) => {
            console.log("Header: Got user settings -----", data);
            if (data.message === 'New User?' || data.message === 'none') {
              console.log("Header: =========== NO USER SETTINGS AVAILABLE");
              dispatch(updateIsReturningUser(false));
              console.log("Header: isReturningUser set to false");
            } else {


              dispatch(updateUserId(userid));
              dispatch(updateMcomProfile(mcomProfile));
              try { // putting in try catch for public view username PDP
                dispatch(updateProfileName(data.username));
              } catch(e){}
              dispatch(updateDefaultWallet(data.default_wallet));
              loadWalletDataToStates(data.wallets);
              dispatch(updateProfileData(data));
              dispatch(updateMagicMetadata(magicMetadata));
              dispatch(updateWalletStatus({ which: "macys", value: true }));
              dispatch(
                  updateAccount({
                    address: magicMetadata.address,
                    network: "0x1",
                    wallet: "macys",
                  })
              );

              dispatch(updateIsLoggedIn(true));
              dispatch(updateIsReturningUser(true));
              sessionStorage.setItem('m3mreturninguser', userid);
              sessionStorage.setItem(
                  "m3mwallets",
                  JSON.stringify({
                    wallets: data.wallets,
                    default: data.default_wallet,
                  })
              );
            }

          });
        }
      } catch (e) {}
    }

    try {
      //check if should sign out
      if (localStorage.getItem("m3signedin")) {
        let hoursMilli = 1000 * 60 * 20; // milliseconds * seconds * minutes
        let difference =
          new Date().getTime() -
          new Date(parseInt(localStorage.getItem("m3signedin"))).getTime();
        if (Math.abs(difference) < hoursMilli) {
          //less than 1 hour
        } else {
          console.log("Header: ******** Login EXPIRED!!! *******")
          sessionStorage.removeItem("mcomProfile");
          sessionStorage.removeItem("m3maccount");
          sessionStorage.removeItem("m3mwallets");
          sessionStorage.removeItem("m3ident");
          sessionStorage.removeItem("m3ids");
          sessionStorage.removeItem("profileName");
          localStorage.removeItem("m3NL");
          sessionStorage.removeItem("loadedvideo");
        }
      }
    } catch(e){

    }

    //click anywhere to hide dropdown menu
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  },[]);

  useEffect(() => {
    if (isLoggedIn) {
      //console.log("Header: captured isLogged in state, ",isLoggedIn)
      // save timestamp of last login
      localStorage.setItem('m3signedin', new Date().getTime())
    }

    if (isLoggedIn && openModal) {
      //console.log("Header: ------------____> show modal ", openModal);
      dispatch(setOpenModal(false))
    }

  }, [isLoggedIn, openModal]);

  useEffect(() => {
    if (navItemActive) {
      console.log("Header: updating nav with ", navItemActive);
    }
  }, [navItemActive]);

  const handleClickOutside = (e) => {
    //console.log("resetting display of dropdown menu");
    setShowDropdown(false);
  }
  
  const onSetLoggedIn = () => {
    //console.log("Header: ------------____> User logged in ");
    
  }  
    

  const onSignin = (e) => {
    e.stopPropagation();
    e.preventDefault();
    //console.log("Header: ------------____> show modal");
    //create an iframe for Macy's authentication for bypassing akamai
    // check it's not on localhost
    if (window.location.host.indexOf("localhost") === -1) {
      MacysAuth.createIframe();
    }
    dispatch(setOpenModal(true));
    setModalState(true);
  };


  const onSignOut = (e) => {
    e.preventDefault();
    console.log("Header: logging out");
    magicauth.user.logout().then(() => {
      console.log("Header: confirmed magic is logged out");

      dispatch(
        updateAccount({
          address: null,
          network: null,
          wallet: null,
        })
      );

      dispatch(updateMcomProfile(null));

      sessionStorage.removeItem("mcomProfile");
      sessionStorage.removeItem("m3maccount");
      sessionStorage.removeItem("m3mwallets");
      sessionStorage.removeItem("m3ident");
      sessionStorage.removeItem("m3ids");
      sessionStorage.removeItem("profileName");
      localStorage.removeItem("m3NL");
      localStorage.removeItem("journee-collect");
      localStorage.removeItem("m3keep");

      dispatch(updateIsLoggedIn(false));
      onSetLoggedOut();
    });
  };

  // called when user is logging out
  const onSetLoggedOut = () => {
    console.log("Header: User logged out");
    setShowDropdown(false);
    router.push("/");
  };

  const onShowProfile = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (showDropdown === true) {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
    
  };

  const onCloseModal = (e) => {
    setModalState(false);
    //dispatch(setOpenModal(false));
  };

  const onProfileRollover = (e) => {
    setProfileRollover(true);
  }

  const onProfileRollout = (e) => {
    setProfileRollover(false);
  }

  const onShowMobileDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (showMobileDropdown === true) {
      setShowMobileDropdown(false);
    } else {
      setShowMobileDropdown(true);
    }
    
  };

  const onHamburgerRollover = (e) => {
    setHamburgerRollover(true);
  }

  const onHamburgerRollout = (e) => {
    setHamburgerRollover(false);
  }

  return (
    <>
      <div id="header" className={styles.header}>
        <div className={styles.container}>
          <div
            className={`${styles.logoContainer} ${isLoggedIn ? styles.signedIn : ""}`}
          >
            <Link href="/">
              <IconLogo/>
            </Link>
          </div>

          <div className={styles.nav}>
            <div className={styles.desktopnav}>
              <Link className={(navItemActive === 'parade')? styles.active : ''} href="/parade">Parade Game</Link>
              <Link className={(navItemActive === 'brands')? styles.active : ''} href="/brand">On 34th Shop</Link>
              <Link className={(navItemActive === 'faq')? styles.active : ''} href="/faq">FAQs</Link>
            </div>
            {isLoggedIn ? (
                <div className={styles.profileIconContainer}>
                  <a href="" onClick={onShowProfile} onMouseOver={onProfileRollover} onMouseOut={onProfileRollout}>
                      {profileRollover? <IconProfileOn /> : <IconProfile />}
                  </a>
                  <HeaderModalMenu
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    onSignOut={onSignOut}
                    isLoggedIn={true}
                  />
                </div>
            ) : (
              isMobile? (
                <div className={styles.signinContainer}>
                  <a href="" onClick={onShowMobileDropdown} onMouseOver={onHamburgerRollover} onMouseOut={onHamburgerRollout}>
                    {hamburgerRollover? <IconHamburgerOn /> : <IconHamburger />}
                  </a>
                  <HeaderModalMenu
                    showDropdown={showMobileDropdown}
                    setShowDropdown={setShowMobileDropdown}
                    onSignIn={onSignin}
                    isLoggedIn={false}
                  />
                </div>
              ) : (
                <div className={styles.signinContainer}>
                  <a href="" onClick={onSignin}>
                    Sign&nbsp;In
                  </a>
                </div>
              )
            )}
          </div>



        </div>
      </div>
      <Signin
        showModal={modalState || openModal}
        onCloseModal={onCloseModal}
        onSetLoggedIn={onSetLoggedIn}
      />
    </>
  );
}