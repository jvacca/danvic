import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateUserId, updateAccount, updateProfileName, updateDefaultWallet, updateWalletStatus, updateProfileData } from '../../reducers/AccountSlice';
import { updateIsLoggedIn, setOpenModal, openModal } from '../../reducers/ApplicationSlice';
import LoginPassword from './LoginPassword';
import LoginEmail from './LoginEmail';
import MagicAuth from './MagicAuth';
import MacysAuth from '../../utils/MacysAuth';
import { imageLoader } from "../../utils/GlobalUtilities";

import HeaderLogoOnly from "../../components/shared/HeaderLogoOnly";
import styles from './Signin.module.scss';

import {setCookie} from '../../utils/GlobalUtilities';
import useAsyncLoad from "../../hooks/useAsyncLoad";
import useWalletStateSync from '../../hooks/useWalletStateSync';

import Image from "next/image";
import ImageSigninBackground from '../../../public/images/scarf.png';

/*

  Module responsibilities: 
  show the modal component
*/

export default function Signin({ showModal, onCloseModal, onSetLoggedIn }) {
  const [isClient, setIsClient] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [stepCounter, setStepCounter] = useState(0);

  const userId = useSelector((state) => state.account.userId);
  const isReturningUser = useSelector((state) => state.application.isReturningUser);
  //const openModal = useSelector((state) => state.application.openModal)
  const dispatch = useDispatch();
  const {loadWalletDataToStates} = useWalletStateSync();
  const loadUserData = useAsyncLoad();
  const [orderOfSteps, setOrderOfSteps] = useState(['email', 'password', 'otpverify']);
  const [step, setStep] = useState('email');
  // let orderOfSteps = ['email', 'password', 'otpverify']
  // let doOnce = true;

  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    if (params.get('claim') && params.get('usertype')) {
      let type = params.get('usertype');
      if (type === 'amex') {
        setOrderOfSteps([type, 'email', 'password', 'otpverify'])
        setStep(type);
      } else {
        setOrderOfSteps([type, 'password', 'otpverify'])
        setStep(type);
      }
    }
  }, []);

  useEffect(() => {
    setStep(getPanelByStep(orderOfSteps[stepCounter]));
  }, []);

  useEffect(() => {
    //console.log("showModal inside Signin:", showModal);
    setIsClient(true);


    if (window.location.host.indexOf("localhost") === -1) {
      MacysAuth.createIframe();
    }
    if (showModal) {
      document.body.classList.add("no-scroll");

    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      // Clean-up function
      document.body.classList.remove("no-scroll");
    };
  }, [showModal, stepCounter]);

  // called when Macy's account login is sucessful
  const handleMacysLogin = (email, mcomProfile) => {
    console.log("Signin: Logging in to Macy's account! ", email, mcomProfile);
    // save email address for profile display
    dispatch(updateUserId(email));
    
    // save mcom data in case we loose the session or for returning users
    console.log('Signin: save storage mcomProfile', mcomProfile)
    // sessionStorage.setItem('mcomProfile', JSON.stringify(mcomProfile))
    let stripped = Object.assign({},mcomProfile)
    try {
      delete stripped.userProfileDetails.dob;
    }catch(e){}
    try {
      delete stripped.loyalty; //not needed for now
    }catch(e){}
    sessionStorage.setItem('mcomProfile', JSON.stringify(stripped))
      if(isClient) {
          let time = 0.02;
          if (localStorage.getItem('m3keep')) {
            time = 7
          }
          try {
            setCookie('macys_online_guid', mcomProfile.userDetails.guid, time);
          } catch(e){}
      }
    // save macy's account metadata here
    dispatch(updateMcomProfile(mcomProfile));
    if (localStorage.getItem('m3keep')) {
      try {
        let lx = JSON.parse(localStorage.getItem('m3keep'));
        let up = Object.assign(lx, {
          email: email
        })
        localStorage.setItem('m3keep', JSON.stringify(up))
      } catch(e){}
    }
    //save userData to DB
    MacysAuth.getSetIds(email, null, 'email');
  }

  //Called when magic auth OTP is completed 
  const handleMagicLogin = (metadata) => {
    console.log("Signin: Logging in to Magic! ", metadata.publicAddress);
    sessionStorage.setItem('m3maccount', JSON.stringify({
        address: metadata.publicAddress,
        network: '0x1',
        wallet: metadata.walletType
    }))

    if (localStorage.getItem('m3keep')) {
      try {
        let lx = JSON.parse(localStorage.getItem('m3keep'));
        let up = Object.assign(lx, {m3maccount: {
            address: metadata.publicAddress,
            network: '0x1',
            wallet: metadata.walletType
          }})
        localStorage.setItem('m3keep', JSON.stringify(up))
      } catch(e){}
    }
    
    dispatch(updateAccount({
      address: metadata.publicAddress,
      network: '0x1',
      wallet: 'macys'
    }));
  }

  const continueToNextStep = () => {
    setStepCounter((previousState) => previousState + 1);
  }

  const onClose = () => {
    console.log("Signin: Closing Signin and updating data ", isReturningUser)
    setStepCounter(0);

    if (isReturningUser || sessionStorage.getItem('m3mreturninguser')) onLoadUserData();
    dispatch(updateIsLoggedIn(true));
    onSetLoggedIn();
    onCloseModal();
  }


  const onMagicCancel = () => {
      console.log("Signin: onCancel Signin and updating data ", isReturningUser)
      setStepCounter(0);
      if (isReturningUser || sessionStorage.getItem('m3mreturninguser')) onLoadUserData();
      dispatch(updateIsLoggedIn(false));
  }

  // this is called when an existing user logs back in
  const onLoadUserData = () => {
    console.log("Signin: Loading user data ", userId)
    // update app states remaining
    try {
      loadUserData('/users/getusersettings', [userId]).then((data) => {
        console.log("Header: from onLoadUserData, got datauser settings  ", data)
        dispatch(updateProfileName(data.username));
        dispatch(updateSubscribeNewsletter(data.notifications_email));
        dispatch(updateNotifications(data.notifications));
        dispatch(updateDefaultWallet(data.default_wallet));
        loadWalletDataToStates(data.wallets);
        // for soft launch assume we will always connect to macys wallet
        dispatch(updateWalletStatus({which: 'macys', value:true}));
        dispatch(updateProfileData(data));
        if (data.username) {
          sessionStorage.setItem('m3mreturninguser', data.userid);
          if (localStorage.getItem('m3keep')) {
            try {
              let lx = JSON.parse(localStorage.getItem('m3keep'));
              let up = Object.assign(lx, {m3mreturninguser: data.userid})
              localStorage.setItem('m3keep', JSON.stringify(Object.assign(up, data)))

            } catch(e){}
          }
        }
      })
    } catch(e) {
      console.log("Signin: failed call get user settings ", e)
    }
    
  }

  const getPanelByStep = (stepStatus) => {
    console.log('Signin: panel: ',stepStatus, stepCounter, showModal)
    switch(stepStatus) {
      case "email":
          return (<LoginEmail setUserEmail={setUserEmail} continueToNextStep={continueToNextStep} />);
      case "password":
        return (<LoginPassword emailAddress={userEmail} handleMacysLogin={handleMacysLogin} continueToNextStep={continueToNextStep} />);
      case "otpverify":
        return (<MagicAuth emailAddress={userEmail} handleMagicLogin={handleMagicLogin} onClose={onClose} onMagicCancel={onMagicCancel} />);
      default:
        return (<LoginEmail setUserEmail={userEmail} continueToNextStep={continueToNextStep} />);
    }
  }

  let showHideModalFunction = () => {
    dispatch(setOpenModal(false));
    onCloseModal();
  }

  return (
    <>
      {showModal && (
        <div>
          <div className={styles.modalContainer}>
            <HeaderLogoOnly setOpenModal={setOpenModal} openModal={openModal} showHideModalFunction={showHideModalFunction} showModal={showModal}/>
            <div className={styles.modalBackgroundContainer}>
              <Image
                alt="name-soon"
                loading="lazy"
                loader={imageLoader}
                src={ImageSigninBackground}
                width="978"
                height="458"
              ></Image>
              
              <div className={styles.modalContentContainer}>
                <div className={styles.modalContent}>
                  <div className={styles.titleBar}><p>Welcome to mstylelab</p></div>
                  {getPanelByStep(orderOfSteps[stepCounter])}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
