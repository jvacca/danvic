const { Magic,  RPCError, RPCErrorCode } = require('magic-sdk');

let otpLogin = null;
let magicauth = null;

export default class MagicAuthHelper  {

  static async getLoggedIn() {
    const isLoggedIn = await magicauth.user.isLoggedIn();
    console.log("MagicAuthHelper: IS LOGGED IN?????? ", isLoggedIn)
    return isLoggedIn;
  }

  static async logoutMagic() {
    await magicauth.user.logout();
    return true;
   }

  static async loginMagic(email) {
    const customNodeOptions = {
      rpcUrl: 'https://polygon-rpc.com/', // Polygon RPC URL
      chainId: 137, // Polygon chain id
    }

    try {
      magicauth = new Magic("pk_live_B2FB59D85E2D18C0", {
        network: customNodeOptions
      });

      const otp = magicauth.auth.loginWithEmailOTP({ email, showUI: false });
      console.log("MagicAuthHelper: calling loginWithEmailOTP ", otp);
      
      otpLogin = otp;

      return otp;
    } catch(e) {
      console.log("MagicAuthHelper: error", e)
    }
    
    
  }

  static getOtpLogin() {
    return otpLogin;
  }

  static resetOtpLogin() {
    otpLogin = null;
  }

  static async handleGetMetadata() {



    const metadata = await magicauth.user.getMetadata();
    console.log("MagicAuthHelper: Magic metadata",metadata)

    //write if not existing
    // let obj = {
    //   userid: sessionStorage.getItem('m3ids'),
    //   notifications_preferences: {
    //     enable_email_notifications: "true",
    //     enable_marketing_email_notifications: false
    //   },
    //   default_wallet: {
    //     address: metadata.publicAddress,
    //     chain: "0x1",
    //     wallet_name: 'macys'
    //   }
    // }
    // loadUserData('/users/getusersettings', [sessionStorage.getItem('m3ids')]).then((data) => {
    //   if (data.message) { // not found
    //     saveUserData('/users/setusersettings', obj).then((res) => {
    //       console.log('new settings')
    //     })
    //   } else {
    //     console.log('data Magic auth found user, updating', obj);
    //     saveUserData('/users/setusersettings', Object.assign(Object.assign(obj, data), {default_wallet: {
    //         address: metadata.publicAddress,
    //         chain: "0x1",
    //         wallet_name: 'macys'
    //       }})).then((res) => {
    //       console.log('update settings')
    //     })
    //   }
    // })



    console.table(metadata);
    return metadata;
  };

}