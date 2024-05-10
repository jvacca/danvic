// React imports
import React, { useEffect, useRef, useState } from "react";
//import Switch from '../shared/Switch';
import GenericModal from '../shared/GenericModal';
import styles from '../../pages/profile/profile.module.scss';
import buttonStyles from '../../components/shared/Button.module.scss';

function RadioGroup ({selectedOption, handleChange}) {
  return (
    <>
      <label>
        <input type="radio" onChange={(e) => handleChange(e)} value={'optin'} checked={selectedOption === 'optin'} /><p>Opt into mstylelab marketing emails.</p>
      </label>
      <label>
        <input type="radio" onChange={(e) => handleChange(e)} value={'optout'} checked={selectedOption === 'optout'} /><p>Unsubscribe from mstylelab marketing emails. Don’t worry, you’ll still receive mystylelab operational emails.</p>
      </label>
    </>
  )

}

export default function ProfileNotifications ({profileData, saveUserData}) {
  const [selectedOption, setSelectedOption] = useState('optin');
  const [status, setStatus] = useState(null);
  const [genericModalState, setGenericModalState] = useState(false);
  const [success, setSuccess] = useState(false)
  //const optin = useRef(null);
  //const optout = useRef(null);

  const unsubscribeCopy = {
    title: "We'll miss you",
    body: "You’ve been successfully removed from our subscriber list and won’t receive further mstylelab marketing emails from us. Don’t worry, you’ll still receive mstylelab operational emails. <br/><br/> Unsubscribed by accident? <a href='/social/mstylelab/profile/notifications'>Resubscribe</a>"
  }


  useEffect(() => {
    //console.log("~~~~~~~~~~~~", profileData)
    if (profileData?.notifications_preferences?.enable_marketing_email_notifications) {
      setStatus(profileData.notifications_preferences.enable_marketing_email_notifications);
    }
  }, []);

  useEffect(() => {
    console.log("status ________> ", status)
    
  }, [status]);

  const handleInputChange = (e) => {
    console.log("on change ", e.currentTarget, e.currentTarget.checked);

    setSelectedOption(e.currentTarget.value);

    if (e.currentTarget.value === 'optin') {
      setStatus("true");
    } else {
      setStatus("false");
    }
    e.currentTarget.checked = true
  }

  const onSavePref = (e) => {
    e.preventDefault();
    console.log("ProfileNotifications: Saving preference ");

    const profileDataCopy = {
      notifications_preferences: {}
    }
    
    if (selectedOption !== status) {
      let tempStatus = (selectedOption === 'optin')? "true" : "false";
      profileDataCopy.notifications_preferences.enable_marketing_email_notifications = tempStatus;
      setStatus(tempStatus);

      if (tempStatus === "false") {
        setGenericModalState(true);
      } else {
        setSuccess(true);
        setTimeout(()=>{
          setSuccess(false);
        },2000)
      }
    } else {
      profileDataCopy.notifications_preferences.enable_marketing_email_notifications = status

      if (status === "false") {
        setGenericModalState(true);
      } else {
        setSuccess(true);
        setTimeout(()=>{
          setSuccess(false);
        },2000)
      }
    }
    
    

    //console.log("ProfileNotifications updating: ", profileDataCopy);
    saveUserData(profileDataCopy);
  };

  const onCloseModal = (e) => {
    setGenericModalState(false);
  }

  return (
    <div className={styles.notificationsPanel}>
      <h2>Email notifications</h2>
      <div className={styles.NotificationList}>
        <form>
          <RadioGroup selectedOption={selectedOption} handleChange={handleInputChange} />
          <input className={buttonStyles['button-green']} type="submit" value={success ? "Success! Opted in" : "Submit"} onClick={(e) => onSavePref(e)} />
        </form>
      </div>
      <GenericModal onCloseModal={onCloseModal} showModal={genericModalState} copy={unsubscribeCopy} />
    </div>
  )
}