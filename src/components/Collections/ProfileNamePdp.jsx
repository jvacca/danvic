import React, {useState, useEffect} from "react";
import Link from 'next/link';
import {useRouter, useParams, useSearchParams, usePathname} from 'next/navigation'

import DataProvider from "../../utils/DataProvider";
import styles from '../../pages/mynfts/[walletid]/nftDetail.module.scss';

import buttonStyles from '../../components/shared/Button.module.scss';
import PopupWindow from "../../components/shared/PopupWindow";
import BadgeButton from '../../components/Collections/BadgeButton';
import IconLogo from "../../assets/svg/icon-logo.svg";

export default function ProfileNamePdp({token, share}) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [initload, setInitload] = useState(false);
  const [attributes, setAttributes] = useState({});

  const [toggleUtility, setToggleUtility] = useState(false);
  const [toggleDetails, setToggleDetails] = useState(false);

  const handleUtilityToggle = () => {
    setToggleUtility(!toggleUtility)
  }

  const handleDetailsToggle = () => {
    setToggleDetails(!toggleDetails);
  }

  const editname = () => {
    // if (window.location.host.indexOf('localhost') > -1) {
        console.log('onboarding', router, pathname)
        sessionStorage.setItem('editingclaim', true);
        let parms = pathname.split('/').filter((o)=>{return o});
        let uname = parms[parms.length-1];
        let name = sessionStorage.getItem("profileName") ? sessionStorage.getItem("profileName") : uname;
        router.push('/?name='+name)
        // try {
        //     let pathp = window.location.pathname.indexOf('/social/mstylelab') > -1 ? '/social/mstylelab' : '/social/1';
        //     window.location.href = window.location.origin + pathp + '?name='+sessionStorage.getItem("profileName");
        // } catch(e){
        //
        // }
    // }
  }

  const animation = () => {
    let mobileCheck = function() {
        try {
            if (/android/i.test(navigator.userAgent)) {
                let check = false;
                (function (a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
                })(navigator.userAgent || navigator.vendor);
                if (window.location.search.indexOf('animation') > -1) {
                    return true;
                }
                return check;
            } else {
                return false;
            }
        } catch(e){
            return false;
        }
    };
    return mobileCheck() ? '' : 'animation'
  }

  useEffect(() => {
    if(window) {
      setTimeout(function(){
        setVisible(true);
      },1000)
    }

    (async () => {
      let url = 'https://web3servicesmcom.herokuapp.com';
      if (window.location.host.indexOf('localhost') > -1) {
          url = 'http://localhost:3005';
      }
        if (window.location.host.indexOf('fds')> -1) {
            url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
        }

        if (token) {
          let getAttr = await DataProvider.getData(`${url}/users/usernameattr?username=${token}`);
          // let getAttr = await DataProvider.getData(`https://web3servicesmcom.herokuapp.com/users/usernameattr?username=${token}&123`);
          console.log('getAttr', getAttr);
          setAttributes(getAttr);
      }
    })();

    window.addEventListener(
      "message",
      (event) => {
          if (event.data.initload) {
              setTimeout(()=>{
                  setInitload(true);
              },2000)
          }
      }, false);

  }, []);

  return (
    <div className={styles.detailsWrap}>
      <Link href="/my-collections">Back to profile</Link>
      <div className={styles.content}>
        <div className={styles.imageBorderGradient}>
          <div className={styles.imageContainer} id={styles['username-frame']}>
            {/*<img alt="nft" src=""/>*/}
              {initload ? null :
                  <PopupWindow
                      className={styles.popupWindowLoading}
                      windowTitle="Welcome to mstylelab"
                      copy="Materializing soon..."
                      loadingBar="true"
                  />
              }
              {visible && token? <iframe
                      src={`//storage.googleapis.com/imp-web3/nft/final-prototype2/index.html?${animation()}&name=${token ? token : 'MSTYLELAB'}&pattern=${attributes.pattern ? attributes.pattern : 6}&palette=${attributes.palette || attributes.palette === 0 ? attributes.palette : 5}&hideGui&puppeteer&hideTool&mynfts`}
                      frameBorder={"none"}
                      scrolling="no"
                      width={window.innerWidth > 768 ? "688" : window.innerWidth}
                      height={window.innerWidth > 768 ? "688" : window.innerWidth}
                  /> : null}
          </div>
        </div>
        <div className={styles.copyContainer}>
          <p className={styles.category}><IconLogo /></p>
          <h2>Digital Fabric</h2>
          <p className={styles.owner}>Owned by {token === sessionStorage.getItem('profileName') ? "you" : token }</p>
          <div className={styles.buttonsHolder}>
            
            {<BadgeButton
              key={"digitItem"}
              badge={"Digital Item"}
              badgeIcon={{imgName:'nft-badge-icon-digital-item2',width:15,height:17}}
            />}
          </div>
          <p>
          Every journey starts with one step, and yours begins with a piece of digital fabric—a mark of your identity, a treasure that's unmistakably yours.<br/><br/>As with any journey, there’s always room for evolution. As you grow and explore, so does the potential of your digital fabric. As horizons expand, so will the opportunities to transform your keepsake.

          </p>

          {/*//share*/}
          <div className={styles.sendShareButtons}>
            <button
              className={buttonStyles["button-green"]}
              onClick={share}
            >
              Share
            </button>
          </div>
            {token === sessionStorage.getItem('profileName') ? <div><button className={styles.editBtn} onClick={editname}>Edit</button></div> : null}
        </div>
      </div>
    </div>
  )
}