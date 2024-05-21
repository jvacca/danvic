// React imports
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Image from 'next/image';
// Assets imports
import styles from '../../pages/profile/profile.module.scss';
import Button from '../UICommon/Button'
import {copyToClipBoard, textEllipsisMid} from '../../services/GlobalUtilities';
import DataProvider from "../../services/DataProvider";
import IConCopy from '../../assets/icon-copy.svg';
import ProfilePicSrc from '../../../public/images/profilePic.png'

export default function ProfileSettings ({profileData, saveUserData}) {
  const [profileName, setProfileName] = useState("");
  const [attributes, setAttributes] = useState({});

  const wallets = useSelector((state) => state.account.wallets);

  useEffect(() => {
    console.log("ProfileSettings: page updating ", profileData)

    if (sessionStorage.getItem('profileName')) {
        // setProfileName(sessionStorage.getItem('profileName'))
      let url = "https://web3servicesmcom.herokuapp.com";
      if (window.location.host.indexOf('localhost')> -1) {
        url = 'http://localhost:3005';
      }
      if (window.location.host.indexOf('fds')> -1) {
        url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
      }
      (async () => {
        if (sessionStorage.getItem('profileName')) {
          let getAttr = await DataProvider.getData(`${url}/users/usernameattr?username=${sessionStorage.getItem('profileName')}`);
          console.log(getAttr);
          setAttributes(getAttr);
        }
      })();
    } else {
      if (profileName) {
        if (profileName !== 'undefined' && profileName !== 'null') {
          sessionStorage.setItem('profileName', profileName);
        }
      }
    }
    if (profileData && profileData.username) {
      if (localStorage.getItem('m3keep')) {
        try {
          let lx = JSON.parse(localStorage.getItem('m3keep'));
          let up = Object.assign(lx, {profileName: profileData.username})
          localStorage.setItem('m3keep', JSON.stringify(up))
        } catch(e){}
      }
    }



  }, [profileData])

  const enterToSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // btnSaveChanges.current.click();
    }
  }

  const getMacysWallet = () => {
    /*
    const found = wallets.find(wallet => wallet.wallet_name === 'macys');
    if (found) {
      return found.address;
    } else {
      return null;
    }*/
    return profileData?.default_wallet?.address 
  }

  const onCopy = (address) => {
    copyToClipBoard(address);
  }

  const handleClick = () => {

  }

  return (
    <>
    <div className={styles.settingsPanel}>
      <h2>Profile Details</h2>

      <div className={styles.formContainer}>
      {(profileData && !profileData.message) &&
        <div>
          <div className={styles.profileImage}>
            <Image src={ProfilePicSrc} alt="trigger icon" />
          </div>
          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Username</p></div>
            <p>{profileData.username}</p>
          </div>
          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Default digital wallet</p></div>
            <p>{textEllipsisMid(getMacysWallet())}</p><button onClick={() => onCopy(getMacysWallet())} className={styles.copyBtn}><IConCopy /></button>
          </div>

          <h2>Account Details</h2>

          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Email<sup>*</sup></p></div>
            <p>{profileData.userid}</p>
          </div>

          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Password</p></div>
            <p>********</p>
          </div>

        </div>
        }
        <Button onclickHandler={handleClick} target="_blank">Change password</Button>
      </div>
    </div>
    </>
  )
}