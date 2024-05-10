import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import MacysAuth from '../../utils/MacysAuth';
import styles from './Signin.module.scss';
import sitewideStyles from '../../styles/sitewide.module.scss';
import buttonStyles from '../shared/Button.module.scss';
import useAsyncLoad from "../../hooks/useAsyncLoad";
import { useDispatch } from 'react-redux';
import { updateIsReturningUser } from '../../reducers/ApplicationSlice';
import Config from '../../config'

import IconExclamation from '../../assets/svg/icon-exclamation.svg';

export default function LoginEmail({setUserEmail, continueToNextStep}) {
  const [errors, setErrors] = useState("");
  const enterEmailRef = useRef(null);
  const btnContinue = useRef(null);
  const loadUserData = useAsyncLoad();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    enterEmailRef.current.focus();
  }, []);

  
  const enterToSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      btnContinue.current.click();
    }
  }

  // reset email if creating account
  const resetemail = (e) => {
    setErrors("")
    enterEmailRef.current.value = "";
  }


  /* Validation has been tested */
  function validateEmail(email) {
    // check for empty textfield
    email = email.toLowerCase()
    if (!email.trim()) {
      //console.log("LoginEmail: email address is blank!");
      setErrors("Please enter your email")
      setDisabled(false);
      return false;
    }
    // check for minimum and maxiumum character count
    if (!(email.length > 6 && email.length <= 320)) {
      //console.log("LoginEmail: email address is too long or too short");
      setErrors("Your email address is too short or too long");
      setDisabled(false);
      return false;
    }
    // check for inclusion of @ and . in address
    if (!(email.indexOf('@') > -1 && email.indexOf('.') > -1)) {
      //console.log("LoginEmail: email address is of wrong format ", email.indexOf('@'), email.indexOf('.'));
      setErrors("Please enter your email address in this format: jane@company.com");
      setDisabled(false);
      return false;
    }
    // check for invalid characters and spaces as well as determining @ and . are in the right place
    // note: we are allowing . @ _ - numbers and capital letters as per the standard (RFC 5322 and RFC 5321 and Macy's account creation standard)
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email))) {
      //console.log("LoginEmail: email address contains invalid characters");
      setErrors("Please enter your email address in this format: jane@company.com");
      setDisabled(false);
      return (false)
    }
    // if all tests pass then return true
    return true;
  }


  const submit = (e) => {
    console.log('in submit-----')
    setDisabled(true);
    setTimeout(function(){
      setDisabled(false); // prevent double click;
    },250)
    const email = enterEmailRef.current.value;
    console.log("LoginEmail: submitting ", email);
      if (sessionStorage.getItem('m3ids')) {
          if (enterEmailRef.current.value.toLowerCase() != sessionStorage.getItem('m3ids').toLowerCase() || enterEmailRef.current.value.toLowerCase() !== sessionStorage.getItem("m3ident").toLowerCase()) { //remove if not the same user
              sessionStorage.removeItem('m3ids');
              sessionStorage.removeItem('m3mwallets');
              sessionStorage.removeItem('profileName');
              sessionStorage.removeItem("mcomProfile");
              sessionStorage.removeItem("profileName");
              sessionStorage.removeItem("m3ids");
              sessionStorage.removeItem("m3ident");
              sessionStorage.removeItem("m3maccount");
              localStorage.removeItem("m3signedin");
              localStorage.removeItem('m3keep');
          }
      }
    if (validateEmail(email)) {
      // check for existing user in db
      loadUserData('/users/getuser?fields=email,username', [email]).then((user) => {
        //TODO: what to do if Keep me signed in was checked?
                
        loadUserData("/users/getusersettings", [email]).then((data) => {
          // console.log("LoginEmail: has user settings? ", data);

          if (data.message === 'New User?' || data.message === 'none') {
            console.log("LoginEmail: not a returninig user, no user data available")
            dispatch(updateIsReturningUser(false));
          } else {
            console.log("LoginEmail: found user settings, it is a returninig user")
            dispatch(updateIsReturningUser(true));
            sessionStorage.setItem('m3mreturninguser', user.email)
          }
        });

        if (user.username) { //must have username
          sessionStorage.setItem('profileName', user.username) // don't reset username if already claimed
          console.log(`LoginEmail: ${user.username} for session`);
          if (localStorage.getItem('m3keep')) {
            try {
              let lx = JSON.parse(localStorage.getItem('m3keep'));
              let up = Object.assign(lx, {profileName: user.username})
              localStorage.setItem('m3keep', JSON.stringify(up))
            } catch(e){}
          }
          if (user.email) {

            /* NOTE: This part has been replaced with checking user_settings above */
            //if (!Config.TEST_ONBOARDING) {
              //console.log("LoginEmail: existing user, just need to authenticate, isReturnUser = true");
              //dispatch(updateIsReturningUser(true));
              //sessionStorage.setItem('m3mreturninguser', user.email)
            //}
            
            try { // for when user goes back to edit email
              setUserEmail(email);
            } catch(e){
              console.log('LoginEmail: Error setUserEmail undefined')
            }
            continueToNextStep();
          } else {
            console.log("LoginEmail: not an existing user, check if it's a Macy's email ", user);
            // if user is new, check that the email is a Macy's account email
            MacysAuth.checkMacysEmailAddress(email).then((resp) => {
              console.log("LoginEmail: response from Macy's auth ", resp, email);
              const isMacys = resp.user.email;

              if (typeof isMacys !== 'undefined') {
                try { // for when user goes back to edit email
                  setUserEmail(email);
                } catch(e){
                  console.log('LoginEmail: Error setUserEmail undefined', isMacys)
                }
                continueToNextStep();
              } else {
                setErrors("It looks like there is no Macy’s account associated with this email address. To access our platform, you need to link your existing Macy’s account or create a Macy’s account.");
                setDisabled(false);
              }
            }).catch((e) => {
              console.log("LoginEmail: Failed Macy's account check ", e)
            })
          }
        } else {
          console.log("LoginEmail: not an existing user, check if it's a Macy's email");
          // if user is new, check that the email is a Macy's account email
          MacysAuth.checkMacysEmailAddress(email).then((resp) => {
            console.log("LoginEmail: response from Macy's auth ", resp, email);
            const isMacys = resp.user.email;

            if (typeof isMacys !== 'undefined') {
              try { // for when user goes back to edit email
                setUserEmail(email);
              } catch(e){
                console.log('LoginEmail: Error setUserEmail undefined', isMacys)
              }
              continueToNextStep();
            } else {
              setErrors("This is not a Macy's email account.");
            }
          }).catch((e) => {
            console.log("LoginEmail: Failed Macy's account check ", e)
          })
        }

      }).catch((e) => {
        console.log("LoginEmail: Failed user account check ", e)
      });      
    } 
    else {
      //setErrors("Please enter your email address in this format: jane@company.com")
    }
        
  }
  
  return (
    <div className={styles.emailContent}>
      <h2>Sign in</h2>
      <p>Enter your Macy’s account email.</p>
      <input className={`${errors ? sitewideStyles.inputError : ""} ${sitewideStyles.textInput}`} ref={enterEmailRef} type="text" placeholder="Email address" onKeyDown={enterToSubmit}></input>
      {errors && <p className={sitewideStyles.errorAlerts}><span><IconExclamation></IconExclamation></span>
        {errors === "This is not a Macy's email account." ? <span className={styles.noEmailM}>It looks like there is no Macy’s account associated with this email address. To access our platform, you need to link your existing Macy’s account or create a Macy’s account.</span>
            : errors}
      </p>}
      {errors === "This is not a Macy's email account." ?
          <div><button className={buttonStyles["button-green"]} onClick={resetemail}>Try Again</button></div>
          : null
      }
      {!errors || errors !== "This is not a Macy's email account." ?
          <button className={buttonStyles["button-green"]} ref={btnContinue} onClick={submit} style={{pointerEvents: disabled ? "none" : "all"}}>Next</button> : null}

      <p>Don't have a Macy's account? <a href={"/account/createaccount/"} target="_blank" onClick={resetemail}>Create Account</a></p>
    </div>
  )
}