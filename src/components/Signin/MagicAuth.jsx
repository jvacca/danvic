// React imports
import React, { useEffect, useState, useRef } from "react";
import { useDispatch,useSelector } from 'react-redux';
import {updateMagicMetadata, updateIsMagicLoggedIn } from '../../reducers/MagicSlice';
import { useRouter, usePathname, useSearchParams  } from "next/navigation";

// assets imports
// import Loading from '../shared/Loading2';
import Loading from '../shared/LoadingBar';
import ConfirmOtp from '../../assets/svg/icon-confirm-otp.svg';
import styles from './Signin.module.scss';
import buttonStyles from '../../components/shared/Button.module.scss';
import loadingBarStyles from '../shared/PopupWindow.module.scss';
import MagicAuthHelper from '../../utils/MagicAuthHelper';
import useAsyncLoad from "../../hooks/useAsyncLoad";
// const saveUserData = useAsyncLoad();
// const loadUserData = useAsyncLoad();

function MagicOTP({onClose, message, emailAddress, handleSubmit, handleCancel, handleResendCode, confirmed, retries, showLoading, onMagicCancel}) {

  const [disabled, setDisabled] = useState(false);
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const navrouter = useRouter();

  const otp1 = useRef(null);
  const otp2 = useRef(null);
  const otp3 = useRef(null);
  const otp4 = useRef(null);
  const otp5 = useRef(null);
  const otp6 = useRef(null);

  useEffect(() => {
    try {
        otp1.current.focus();
    } catch(e){}
  }, []);

  function concatOTPCode() {
    return otp1.current.value +
    otp2.current.value +
    otp3.current.value +
    otp4.current.value +
    otp5.current.value +
    otp6.current.value;
  }

  function clearOTPCode() {
    otp1.current.value = '';
    otp2.current.value = '';
    otp3.current.value = '';
    otp4.current.value = '';
    otp5.current.value = '';
    otp6.current.value = '';
  }

  function handleInputChange(e, nextInputRef, prevInputRef) {
    if (e.target.value.length === 1 && nextInputRef) {
      nextInputRef.current.focus();
    }
    if (e.key === 'Backspace' && !e.target.value && prevInputRef) {
      prevInputRef.current.focus();
    }
  }


  async function Paste(e,a,b) {
    e.preventDefault();
    // console.log('val',e)
    let txt = (e.clipboardData || window.clipboardData).getData("text");
    var val =  txt.split('')
        .filter(function(e){ return e !== ' ' && e});

    otp1.current.value = val[0];
    otp2.current.value = val[1];
    otp3.current.value = val[2];
    otp4.current.value = val[3];
    otp5.current.value = val[4];
    otp6.current.value = val[5];

    let valcon = concatOTPCode();

    console.log('MagicOTP: Paste val', txt, 'val', valcon);
    handleSubmit(valcon)
  }


  const onSubmit = async (e) => {
    console.log('MagicOTP: on submit');
    //e.preventDefault();
    const otpCode = concatOTPCode();
    
    handleSubmit(otpCode)
  };

  const onCancel = () => {
    console.log('MagicOTP: on cancel');

    clearOTPCode();

    handleCancel()
  };

  const handleClose = () => {
    console.log("MagicAuth: Handling close")
    let params = new URLSearchParams(window.location.search);
    if (params.get('claim')) {
      console.log('inclaimflow, handleclose')
      navrouter.push(`/?claim=${params.get('claim')}&signedin=true&usertype=${params.get('usertype')}${params.get('claimid') ? "&claimid="+params.get('claimid'): ""}${params.get('amexuser') ? "&amexuser=true" : ""}`)
      onClose();
    } else {
      onClose();
    }
  }

    const cancelLogin = () => {
        console.log("MagicAuth: Handling cancel")
        // window.location.reload();
        handleCancel()
        // setTimeout(function(){
        // try {
        //     msignIn.modal[1](true);
        // } catch(e){
        //   console.log(e)
        // }
        // },1000)
    }

  const onResendCode = (e) => {
    e.preventDefault();
    console.log("MagicOTP: Cancelling");
    clearOTPCode();
    
    handleResendCode();
  }

  return (
    <>
    {showLoading ?
    <div className={styles.centerLoader}>
      <Loading
        className={loadingBarStyles.loadingBarContainer}
        isShowing={true}
        copy={"Your style journey starts now..."}
      />
    </div>
    :
    <div id="otp-component" className={styles.otpComponent}>
        {!confirmed && <h2>{message === 'You want to change your email' ? 'Change your login email' : 'Enter access code'}</h2>}
        
        {(confirmed)?
          <div className={styles.stylesconfirmation}>
            <ConfirmOtp />
            <button id="cancel-otp" className={buttonStyles['button-green']} onClick={handleClose} disabled={disabled}>
                Next
            </button>
          </div>
          :
            (message === 'You want to change your email') ? (
                <form>
                  <p id="otp-instructions" className={styles.enterOtp}>{message}</p>
                  <button id="cancel-otp" className={buttonStyles['button-green']} onClick={cancelLogin}>
                    Go back to change
                  </button>
                </form>
                ) :

              (<form>
                <p>We’ve sent a 6-digit code to</p>
                <p>{emailAddress}</p>
                <p id="otp-instructions" className={styles.enterOtp}>{message}</p>

                <div className={styles.magicOtp}>
                  <input name="otp1" inputMode="numeric" ref={otp1} onPaste={Paste} maxLength="1" onChange={(e) => handleInputChange(e, otp2, null)} onKeyDown={(e) => handleInputChange(e, otp2, null)} />
                  <input name="otp2" inputMode="numeric" ref={otp2} maxLength="1" onChange={(e) => handleInputChange(e, otp3, otp1)} onKeyDown={(e) => handleInputChange(e, otp3, otp1)} />
                  <input name="otp3" inputMode="numeric" ref={otp3} maxLength="1" onChange={(e) => handleInputChange(e, otp4, otp2)} onKeyDown={(e) => handleInputChange(e, otp4, otp2)} />
                  <input name="otp4" inputMode="numeric" ref={otp4} maxLength="1" onChange={(e) => handleInputChange(e, otp5, otp3)} onKeyDown={(e) => handleInputChange(e, otp5, otp3)} />
                  <input name="otp5" inputMode="numeric" ref={otp5} maxLength="1" onChange={(e) => handleInputChange(e, otp6, otp4)} onKeyDown={(e) => handleInputChange(e, otp6, otp4)} />
                  <input name="otp6" inputMode="numeric" ref={otp6} maxLength="1" onChange={(e) => onSubmit()} onKeyDown={(e) => handleInputChange(e, null, otp5)} />
                </div>
                <p><a href="" onClick={onResendCode}>Resend</a></p>
              </form>)

        }
    </div>
      }
    </>
  )
}

export default function MagicAuth({emailAddress, handleMagicLogin, onClose, onMagicCancel}) {
  //const [otpLogin, setOtpLogin] = useState(null);
  const [message, setMessage] = useState("");
  const [showUI, setShowUI] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [retries, setRetries] = useState(6);
  const [showLoading, setShowLoading] = useState(false);
  const subscribeNewsletter = useSelector((state) => state.account.subscribeNewsletter);
  const profileName = useSelector((state) => state.account.profileName);
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const navrouter = useRouter();

  const saveUserData = useAsyncLoad();
  const loadUserData = useAsyncLoad();

  window.MagicAuthHelper = MagicAuthHelper;
  window.mauth = {
    'message': [message, setMessage],
      "ui": [showLoading, setShowLoading]
  }

  const dispatch = useDispatch();
  let otpLogin
   const otp1 = useRef(null);


  function sendOTPCode(emailAddress) {
    const otp = MagicAuthHelper.loginMagic(emailAddress).then((data) => {
      console.log("MagicOTP: OTP started")
    })
    .catch(e => {
      console.log("MagicOTP: catching from the promise ", e)
    })

    otpLogin = MagicAuthHelper.getOtpLogin();
    console.log('MagicOTP: ***************', otpLogin)
      
      console.log("MagicAuth: trying to send OTP email ", emailAddress);

      if (otpLogin) {
        otpLogin
        .on('device-needs-approval', () => {
            // is called when device is not recognized and requires approval
            console.log('MagicOTP: device-needs-approval')
        })
        .on('device-verification-email-sent', () => {
            // is called when the device verification email is sent
            console.log('MagicOTP: device-verification-email-sent')
        })
        .on('device-approved', () => {
            // is called when the device has been approved
            console.log('MagicOTP: device-approved')
        })
        .on('device-verification-link-expired', () => {
            // is called when the device verification link is expired
            // Retry device verification
            console.log('MagicOTP: device-verification-link-expired')
            otpLogin.emit('device-retry');
        })
        .on("email-otp-sent", () => {
          console.log("MagicAuth: email OTP sent!");
          setShowUI(true);
        })
        .on('verify-email-otp', ()=> {
          console.log("MagicAuth: received email-otp");

        })
        .on("done", (result) => {
          console.log("MagicAuth: done logging in, getting metadata");
          setShowUI(true);
          const isLoggedIn = MagicAuthHelper.getLoggedIn().then((data) => {
            console.log("MagicAuth: getLoggedIn returned this data ", data);

            if (data === true) {
              // update login status on magic slice
              dispatch(updateIsMagicLoggedIn(true));
      
              const metadata = MagicAuthHelper.handleGetMetadata().then(data => {
                console.log("MagicAuth: Magic metadata received")

                let obj = {
                  userid: sessionStorage.getItem('m3ids'),
                  notifications_preferences: {
                    enable_email_notifications: "true",
                    enable_marketing_email_notifications: (subscribeNewsletter == true) ? "true" : "false"
                  },
                  default_wallet: {
                    address: data.publicAddress,
                    chain: "0x1",
                    wallet_name: 'macys'
                  }
                }
                if (profileName) {
                  obj.username = profileName;
                }
                loadUserData('/users/getusersettings', [sessionStorage.getItem('m3ids')]).then((mdata) => {
                  if (mdata.message) { // not found
                    obj.wallets = [
                      {
                        address: data.publicAddress,
                        chain: "0x1",
                        wallet_name: 'macys'
                      }
                    ]
                    saveUserData('/users/setusersettings', obj).then((res) => {
                      console.log('new settings')
                    })
                  } else {
                    console.log('data Magic auth found user, updating', obj);
                    saveUserData('/users/setusersettings', Object.assign(Object.assign(obj, mdata), {default_wallet: {
                        address: data.publicAddress,
                        chain: "0x1",
                        wallet_name: 'macys'
                      }})).then((res) => {
                      console.log('update settings')
                    })
                  }
                })


                // save the metadata in magic slice
                dispatch(updateMagicMetadata(data))
                handleMagicLogin(data);
                setMessage("Nice, your email has been verified")
                setConfirmed(true);
                setShowLoading(false)
              })
            }
          })
        })
        .on("settled", () => {
          console.log('MagicAuth: settled in Login.js', 'do the same as done?');
            // setShowUI(true);
            // const isLoggedIn = MagicAuthHelper.getLoggedIn().then((data) => {
            //     console.log("MagicAuth: getLoggedIn returned this data ", data);
            //
            //     if (data === true) {
            //         // update login status on magic slice
            //         dispatch(updateIsMagicLoggedIn(true));
            //
            //         const metadata = MagicAuthHelper.handleGetMetadata().then(data => {
            //             console.log("MagicAuth: Magic metadata received")
            //             // save the metadata in magic slice
            //             dispatch(updateMagicMetadata(data))
            //             handleMagicLogin(data);
            //             setMessage("Nice, your email has been verified")
            //             setConfirmed(true);
            //             setShowLoading(false)
            //         })
            //     }
            // })
        })
        .on("invalid-email-otp", () => {
          if (retries < 0) {
            setMessage("MagicOTP: No more retries. Please try again later.");
            setShowLoading(false)
            // Cancel the login
            handleCancel();
          } else {
            // TODO: the retries are not counted correctly
            setMessage(
              `Incorrect code. Please enter OTP again.`
            );
            setShowLoading(false)
          }
        })
        .on("error", (e) => {
          console.log('MagicAuth: error with OTP sending or a cancel', e);
          if (e.toString().indexOf('-10005') > -1) { //user wants to change email
            console.log('MagicOTP: user wants to edit email, push them back to step 1', onMagicCancel)
            setMessage("You want to change your email");
            setShowLoading(false);
            setShowUI(true);
            document.querySelector('#magic-iframe').style.display = 'none';
            // onMagicCancel();
            // debugger;
            // handleCancel();
          } else if (e.toString().indexOf('-32603') > -1) { //Internal error: The login flow for this auth user is expired
            setMessage("This OTP has expired please go back and try again");
            setShowLoading(false);
            setShowUI(true);
            document.querySelector('#magic-iframe').style.display = 'none';
          } else {

          }
        })
        .catch((err) => {
          console.log("MagicAuth: error ", err);
            if (err.toString().indexOf('-10005') > -1) { //user wants to change email
                console.log('MagicOTP: user wants to edit email, push them back to step 1', onMagicCancel)
                setMessage("You want to change your email");
                setShowLoading(false);
                setShowUI(true);
                document.querySelector('#magic-iframe').style.display = 'none';
                // onMagicCancel();
                // msignIn.modal[1](true)
                // handleCancel();
                // otpLogin.finally(function(){
                //
                // })
            } else if (err.toString().indexOf('-32603') > -1) { //Internal error: The login flow for this auth user is expired
              setMessage("This OTP has expired please go back and try again");
              setShowLoading(false);
              setShowUI(true);
              document.querySelector('#magic-iframe').style.display = 'none';
            } else {

            }
        });
    }
  }

  useEffect(() => {
    if (otp1.current) {
      otp1.current.focus();
    }
      //let otp = magicauth.auth.loginWithEmailOTP({ emailAddress, showUI: false }).then((data) => {
        //console.log("OTP started")
      //});
    sendOTPCode(emailAddress)
              
  }, []);

  const handleSubmit = async (otpCode) => {
    console.log('MagicAuth: handleSubmit EmailOTP', otpCode);
    //setDisabled(true);
    setRetries((c) => c - 1);
    
    // Send OTP for verification
    const otpLogin = MagicAuthHelper.getOtpLogin();
    otpLogin.emit("verify-email-otp", otpCode);
    setShowLoading(true);
  };

  const handleCancel = () => {

    console.log('MagicAuth: handle cancel');
    const otpLogin = MagicAuthHelper.getOtpLogin();
    otpLogin.emit("cancel");
    onMagicCancel();
  };

  const handleResendCode =() => {
    console.log("MagicAuth: Cancelling OTP first then resending");

    setMessage('');
    const otpLogin = MagicAuthHelper.getOtpLogin();
    otpLogin.emit("cancel");
    // reset otpLogin
    sendOTPCode(emailAddress)
  }

  return (
    <div className={styles.magicAuthContainer}>
    {(showUI)?
    <MagicOTP 
      onClose={onClose}
      message = {message}
      emailAddress = {emailAddress}
      handleSubmit = {handleSubmit}
      handleCancel = {handleCancel}
      handleResendCode = {handleResendCode}
      confirmed = {confirmed}
      retries = {retries}
      showLoading = {showLoading}
      magicCancel={onMagicCancel}
    />
    :
    <div className={styles.centerLoader}>
      <Loading 
      className={loadingBarStyles.loadingBarContainer} 
      isShowing={true}
      copy={"Your style journey starts now..."}
      />
      </div>
    }
    </div>
  )
}