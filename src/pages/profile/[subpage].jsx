// React imports
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import {updateProfileData, updateWallets} from '../../reducers/AccountSlice';
import Link from 'next/link';
import Head from '../../components/Head';
import ProfileSettings from '../../components/Profile/ProfileSettings';
import ProfileWallets from '../../components/Profile/ProfileWallets';
import Dashboard from '../../components/Profile/Dashboard';

//import profileData from '../../../data/profile.json'

//library imports
import useAsyncLoad from "../../hooks/useAsyncLoad";

import styles from './profile.module.scss';

export default function Profile({subpage}) {
  //const params = useParams();
  const profileData = useSelector((state) => state.account.profileData);
  const [routename, setRoutename] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const loadUserProfileData = useAsyncLoad();

  useEffect(() => {
    const {subpage} = router.query;
      if (subpage === 'wallet' || subpage === 'settings' || subpage === 'dashboard') {
        //("Profile: detected a subpage ", subpage)
        setRoutename(subpage);
      }
     
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.subpage])

  useEffect(() => {
    if (profileData) console.log("Profile: updating page");
  }, [profileData])

  const getPanelByName = (panelname) => {
    //console.log('Profile name check: ************', panelname)
    switch(panelname) {
      case "settings":
        return (<ProfileSettings profileData={profileData} saveUserData={saveUserData} />);
      case "wallet":
          return (<ProfileWallets profileData={profileData} />);
      case "dashboard":
        return (<Dashboard profileData={profileData} saveUserData={saveUserData} />);
      default:
        return (<ProfileSettings profileData={profileData} saveUserData={saveUserData} />);
    }

  }

  const saveUserData = (obj) => {
    console.log("Profile: actually writing to db ", obj);
    obj.userid = sessionStorage.getItem('m3ids');
    loadUserProfileData('/users/setusersettings', obj).then((res) => {
      console.log("Profile: Saved: ", res);
      dispatch(updateProfileData(res))
    })
  }

  return (
    <>
    <Head title="Macy's STYL - Profile" />
    <div className={styles.profileFrame}>
      
      <div className={styles.profileContent}>
        <h2>User Settings</h2>
        <div className={styles.profileSummary}>
          
        </div>
        <div className={styles.inner}>
          
          <div className={styles.profileInner}>
            <div className={styles.sidebar}>
              <ul>
                <li><Link href="/profile/settings" className={`${router.query.subpage === 'settings' ? styles.active : ""}`}>Profile</Link></li>
                <li><Link href="/profile/wallet" className={`${router.query.subpage === 'wallet' ? styles.active : ""}`}>Wallets</Link></li>
                <li><Link href="/profile/dashboard" className={`${router.query.subpage === 'dashboard' ? styles.active : ""}`}>Dashboard</Link></li>
              </ul>              
            </div>

            <div className={styles.panels}>
              {(routename || profileData) && getPanelByName(routename)}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}