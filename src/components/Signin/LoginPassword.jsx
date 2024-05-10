// React imports
import React, { useRef, useState, useEffect } from "react";
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import MacysAuth from '../../utils/MacysAuth';
import {updateSubscribeNewsletter, updateNotifications} from '../../reducers/AccountSlice';
import styles from './Signin.module.scss';
import sitewideStyles from '../../styles/sitewide.module.scss';
import buttonStyles from '../shared/Button.module.scss';
import loadingBarStyles from '../shared/PopupWindow.module.scss';
import IConMacys from '../../assets/svg/icon-macys.svg';
// import Loading from '../shared/Loading2';
import Loading from '../shared/LoadingBar';

// assets imports
import './Signin.module.scss';
import IconExclamation from "../../assets/svg/icon-exclamation.svg";
import IconShow from "../../assets/svg/icon-show.svg";

export default function LoginPassword({emailAddress, handleMacysLogin, continueToNextStep}) {
  const [errors, setErrors] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const enterPasswordRef = useRef(null);
  const checkRef = useRef(null);
  const btnSignin = useRef(null);
  const dispatch = useDispatch();
  const subscribeNewsletter= useSelector((state) => state.account.subscribeNewsletter);

  useEffect(() => {
    enterPasswordRef.current.focus();
  }, []);

  const enterToSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnSignin.current.click();
    }
  }
  
  function validatePassword(passwd) {
    if (!passwd.trim()) {
      //console.log("LoginPassword: password is blank!");
      setErrors("Please enter your password");
      return false;
    }

    if (!(passwd.length > 6 && passwd.length <= 16)) {
      //console.log("LoginEmail: password is too long or too short");
      setErrors("Your password must be between 7-16 characters, and cannot include . , - | \ / = _ or spaces. Please try again.");
      return false;
    }

    if ((/[,\.\-|\\\|\/=_\s]/g.test(passwd))) {
      //console.log("LoginEmail: email address contains invalid characters");
      setErrors("Your password must be between 7-16 characters, and cannot include . , - | \ / = _ or spaces. Please try again.");
      return (false)
    }

    // if all tests pass then return true
    return true;
  }

  const handleRememberUser = () => {
    //TODO: add code to add this option to the api call for authenticating
    console.log('keep me signed in')
    // where did code for this go?
    if (!localStorage.getItem('m3keep')) {
      localStorage.setItem('m3keep', JSON.stringify({}));
    } else {
      // if (sessionStorage.getItem('profileName')) {
      //   if (sessionStorage.getItem('profileName')!== 'null' && sessionStorage.getItem('profileName') !== 'undefined') {
      //     let lx = JSON.parse(localStorage.getItem('m3keep'));
      //     localStorage.setItem(Object.assign(lx, {profileName: sessionStorage.getItem('profileName')}));
      //   }
      // }
    }
  }

  const handleSubscribe = () => {
    dispatch(updateSubscribeNewsletter(false));
  }

  const handleDetails = (e) => {
    e.preventDefault();
    return setShowDetails(!showDetails);
  }

  const submit = (e) => {
    const password = enterPasswordRef.current.value;
    console.log("LoginPassword: submitting ", emailAddress);

    if (validatePassword(password)) {
      setShowUI(false)
      try {
        MacysAuth.loginMacysAccount(emailAddress, password).then((data) => {
          console.log("LoginPassword: Response from macys login api", data);
          let params = new URLSearchParams(window.location.search);

          if (data && data.mcomProfile && data.mcomProfile.access_token) {
            handleMacysLogin(emailAddress, data.mcomProfile);
            if (!sessionStorage.getItem('mcomProfile')) {
              console.log('----amex --- for some reason mcomProfile never gets set', data)
              sessionStorage.setItem('mcomProfile', data.mcomProfile);
            } else {

            }
            if (params.get('usertype')) {
             //wait for amex check
              if (params.get('usertype') === "amex") {
                let isAmex = sessionStorage.getItem('m3typeuser') === 'amex';
                try {
                  let amexuser = data.mcomProfile.profileheader.billingMapper.filter((o)=>{
                    return o.creditcarddetails.cardtype == 'B'
                    // && o.creditcarddetails.expirationyear >= 2023
                  });
                  if (amexuser.length > 0) {
                    isAmex = true
                  }
                } catch(e){}
                if (isAmex) {
                  if (window.location.host.indexOf('localhost') > -1) {
                    alert('success Amex')
                  }
                  continueToNextStep();
                } else {
                  // if (window.location.host.indexOf('localhost') > -1) {
                  //   alert('not Amex!');
                  // }
                  setErrors('This is not a valid Macy’s American Express® Card account.')
                  setShowUI(true)
                }
              } else if (params.get('usertype') === "game") {
                console.log('logging in as game user')
                let isAmex = sessionStorage.getItem('m3typeuser') === 'amex';
                if (window.location.host.indexOf('localhost') > -1 && isAmex) {
                  alert('success Amex')
                }
                // check if is amex coming from game
                continueToNextStep();
              } else if (params.get('usertype') === "other")  {
                continueToNextStep();
              } else {

              }


              } else {
              console.log('logging in as other user')
              continueToNextStep();
            }
          } else {
            console.log("LoginPassword: no access_token found, password is probably invalid ", data)
            setShowUI(true)
            setErrors("password invalid");
          }
          
        })
      } catch(e) {
        setShowUI(true)
        console.log("LoginPassword error:", e)
      }
    } 
    else if (!password.trim()) {
      setErrors("Password required")
      return;
    }
    else {
      //setErrors("Your password must be between 7-16 characters, and cannot include . , - |  / = _ or spaces. Please try again.");
    }
  }

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    {showUI ?
      <div id="passwordPanel" className={styles.passwordContent}>
        <h2>Enter your password</h2>
        <p className={styles.emailAddress}>{emailAddress}</p>
        <div className={styles.passwordInputContainer}>
          <input
            ref={enterPasswordRef}
            type={showPassword ? "text" : "password"} // Conditionally set the type based on showPassword state
            placeholder="Password"
            onKeyDown={enterToSubmit}
            className={`${errors ? sitewideStyles.inputError : ""} ${
              sitewideStyles.textInput
            }`}
          />
          <div className={styles.eyeIcon} onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : <p className="styles.showHide"> <IconShow></IconShow> <span>Show</span></p>}
          </div>
        </div>
        <button
          className={buttonStyles["button-green"]}
          ref={btnSignin}
          onClick={submit}
        >
          Next
        </button>
        {errors && (
          <div>
            <p className={sitewideStyles.errorAlerts}>
              <span><IconExclamation></IconExclamation></span>
              {errors}
            </p>
            <p className={styles.caseSensitive}>Case sensitive</p>
          </div>
        )}
        <div className={`${styles.inputContainer} ${styles.keepSignedContainer}`}>
          <input
            ref={checkRef}
            type="checkbox"
            onKeyDown={handleRememberUser}
            onChange={handleRememberUser}
          ></input>
          <p className={styles.keepSigned}>
            Keep me signed in.{" "}
            <a href="" onClick={handleDetails}>
              Details
            </a>
            {showDetails && <span>
              We’ll keep you signed in on this device. To keep your account secure,
              we may ask you for your password when accessing your personal
              information. <br/>Only check this box if on a personal device
            </span>}
          </p>
        </div>
          <div className={`${styles.inputContainer} ${styles.subscribeContainer} ${showDetails ? styles.active : ''}`}>

          <input ref={checkRef} type="checkbox" defaultChecked={subscribeNewsletter} data-sub={subscribeNewsletter} onKeyDown={handleSubscribe}></input>
          <p className={styles.keepSigned}>
            Subscribe to mstylelab marketing emails.
          </p>
        </div>
        <p className={styles.privacyNote}>
        <a href="https://auth.macys.com/forgot-password/" target="_blank">
          Forgot your Macy's password?
        </a>
        </p>
        <p className={styles.privacyNote}>
          By logging in, you agree to Macy’s <a href="https://customerservice-macys.com/articles/highlights-of-macys-inc-notice-of-privacy-practices" target="_blank">Privacy Policy</a> and <Link href="/termsofservice" target="_blank">Terms of Use</Link>.
        </p>
      </div>
      :
      <div className={styles.centerLoader}>
        <Loading 
          className={loadingBarStyles.loadingBarContainer} 
          isShowing={true} 
          copy="Your style journey starts now..."
          />
      </div>
    }
    </>
  );
}