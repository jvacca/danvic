// React imports
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Button from '../UICommon/Button'
// Assets imports
import styles from '../../pages/profile/profile.module.scss';
import {copyToClipBoard, textEllipsisMid} from '../../utils/GlobalUtilities';
import DataProvider from "../../utils/DataProvider";
import IConCopy from '@/assets/icon-copy.svg';

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
    const found = wallets.find(wallet => wallet.wallet_name === 'macys');
    if (found) {
      return found.address;
    } else {
      return null;
    }
    
  }

  const onCopy = (address) => {
    copyToClipBoard(address);
  }

  return (
    <>
    {/*profileData ?
        <iframe src={ `https://storage.googleapis.com/imp-web3/nft/final-prototype2/index.html?hideTool&name=${profileData.username}&density=${attributes.density}&palette=${attributes.palette}`  } frameBorder={'none'} width="512" height="512"/>
    : null}*/}

    <div className={styles.settingsPanel}>
      <h2>mstylelab account details</h2>

      <div className={styles.formContainer}>
      {(profileData && !profileData.message) &&
        <div>
          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Username</p></div>
            <p>{profileData.username}</p>
          </div>
          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Macy's digital address</p></div>
            <p>{textEllipsisMid(getMacysWallet())}</p><Button onClick={() => onCopy(getMacysWallet())} className={styles.copyBtn}><IConCopy /></Button>
          </div>

          <h2>Macy's account details</h2>

          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Email<sup>*</sup></p></div>
            <p>{profileData.userid}</p>
                <p className={styles.small}><sup>*</sup>Heads up! Changing your macys.com account email address will result in your mstylelab account and digital address being deleted, so choose an email address you are likely to have for a long time.</p>
          </div>

          <div className={styles.halfBlock}>
            <div className={styles.label}><p>Password</p></div>
            <p>********</p>
          </div>

        </div>
        }
        <a className={`${styles.editButton}`} href="https://www.macys.com" target="_blank">Edit Settings On macys.com</a>
      </div>
    </div>
    </>
  )
}