import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Image from 'next/image';
import WalletScanner from '../WalletComponents/WalletScanner.jsx'
import styles from './profile.module.scss';
import ProfilePicSrc from '../../../public/images/profilePic.png'

export default function Dashboard({profileData}) {
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
            <h2>Dashboard for: {profileData.username}</h2>
              <div className={styles.profileImage}>
                <Image src={ProfilePicSrc} alt="trigger icon" />
              </div>
              <WalletScanner />
          </div>
        </div>
      </div>
      </>
  )
}