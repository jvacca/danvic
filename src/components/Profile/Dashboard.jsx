import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Picture from '../UICommon/Picture';
import Head from '../Head';
import WalletScanner from '../WalletComponents/WalletScanner.jsx'
import styles from './profile.module.scss';

export default function Dashboard() {
  const walletManager = useRef();

  const profileName = useSelector((state) => state.account.profileName);
  const [profileNameTitle, setProfileNameTitle] = useState(null)
  
  function NotifyBar({ copy, color }) {
      return (
        <div className={`${styles.notifyBarContainer}`}>
          <div className={styles.notifyBar} style={{ backgroundColor: `${color}` }}>
            <Picture 
              desktop="icon-ox.svg"
            />
            <div className={styles.copy}>
              <p>{copy}</p>
            </div>
          </div>
        </div>
      );
  }

  useEffect(() => {
    let profName = sessionStorage.getItem('profileName')

    if (profName || profileName) {
        let name = profileName? profileName : profName;
        setProfileNameTitle(name);
    }
  }, [profileName])

  return (
      <>
      <Head title="Macy's STYL - My Collections"/>
      <div className={styles.collectionsFrame}>
        <div className={styles.collectionsPanels}>
          <div className={styles.collectionsContent}>
            <div className={styles.heading}>
            {profileNameTitle?
              <NotifyBar copy={profileNameTitle + ".mstylelab"} className="profile" color="#ffffff" />
              :
              <NotifyBar copy={"Profile"}  color="#ffffff" />}
              <div>
                  <p></p>
              </div>
            </div>
            <WalletScanner />
          </div>
        </div>
      </div>
      </>
  )
}