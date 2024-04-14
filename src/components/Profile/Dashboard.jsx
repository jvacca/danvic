import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Picture from '../UICommon/Picture';
import WalletScanner from '../WalletComponents/WalletScanner.jsx'
import styles from './profile.module.scss';

export default function Dashboard() {
  const walletManager = useRef();

  const profileName = useSelector((state) => state.account.profileName);
  const [profileNameTitle, setProfileNameTitle] = useState(null)

  useEffect(() => {
    let profName = sessionStorage.getItem('profileName')

    if (profName || profileName) {
        let name = profileName? profileName : profName;
        setProfileNameTitle(name);
    }
  }, [profileName])

  return (
      <>
      <div className={styles.collectionsFrame}>
        <div className={styles.collectionsPanels}>
          <div className={styles.collectionsContent}>
            <h2>User Dashboard</h2>
              <div>
                  <p></p>
              </div>
            <WalletScanner />
          </div>
        </div>
      </div>
      </>
  )
}