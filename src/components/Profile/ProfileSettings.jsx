/* eslint-disable react/no-unescaped-entities */
// React imports
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Button from '../UICommon/Button'
// Assets imports
import styles from '../../pages/profile/profile.module.scss';
import {copyToClipBoard, textEllipsisMid} from '../../utils/GlobalUtilities';
import DataProvider from "../../utils/DataProvider";
import RegistrationForm from '../../pages/register/RegistrationForm'

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

  const submitData = (e) => {
    setIsRegistered(true)
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
      <h2>Account Profile Details</h2>

      <div className={styles.formContainer}>
        <RegistrationForm useAddressValidation={false} submitData={submitData} />
      </div>
    </div>
    </>
  )
}