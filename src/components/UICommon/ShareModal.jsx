import React, {useEffect, useState} from "react";
import {copyToClipBoard} from '../../utils/GlobalUtilities';
import IConTwitter from '../../assets/svg/icon-twitter.svg';
import IConFacebook from '../../assets/svg/icon-facebook.svg';
import IConDownload from '../../assets/svg/icon-download.svg';
import IConCopyLink from '../../assets/svg/icon-copy.svg';
import IconClose from '../../assets/svg/icon-close-black.svg';

import styles from './ShareModal.module.scss';
import DataProvider from "../../utils/DataProvider";
let doOnce = true;
setTimeout(function(){
    doOnce = true;
},10000)

export default function ShareModal({showModal, onCloseModal, namesave, nftMedia}) {
    const [short, setShort] = useState();
    const [fullImg, setFullImg] = useState();
    const [disabled, setDisabled] = useState(true);
    // let short = ""
    // let pdp = ""
    // const [pdp, setPdp] = useState();

    // const facebookCopy = "It’s here! Check out my new digital identity from styl.  Design your own at http://www.macys.com/social/mstylelab."
// const facebookCopy = "It’s here! Check out my new digital fabric from mstylelab. Want to claim yours, too? Head over to https://www.macys.com/social/mstylelab.";
  // const twitterCopy = "mstylelab digital identity has officially materialized. Take a look! http://www.macys.com/social/mstylelab"
// const twitterCopy = "My mstylelab digital fabric has officially materialized. Check it out and claim your own at https://www.macys.com/social/mstylelab!";
const facebookCopy = "Look what I just made 👀 %23mstylelab %23digitalfabric %40macys";
const twitterCopy = "Look what I just made 👀 %23mstylelab %23digitalfabric %40macys"
const AltTwitterCopy = "Take a look! https://www.macys.com/social/mstylelab"


    useEffect(() => {
        window.short = null;
        window.pdp = null;
        setTimeout(()=>{
            setDisabled(false);
        },1000)
    }, [disabled]);

  const getLink = (t) => {
    if (nftMedia) {
      console.log("It's an NFT! ", nftMedia.replace('ipfs://', "https://ipfs.io/ipfs/"));

      return nftMedia.replace('ipfs://', "https://ipfs.io/ipfs/").replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.pinata.cloud', 'ipfs.io')  
    } else {
      let name1 = namesave;
      if (!namesave) {
          try {
              name1 = sessionStorage.getItem('profileName');
          } catch(e){}
      }

      console.log("It's a profile name ", namesave, name1);
      if (!name1) {
          if (window.location.pathname.indexOf('mynfts') > -1) {
              name1 = window.location.pathname.split('mynfts/username/')[1];
          }
      }
      // let url  = "https://storage.googleapis.com/imp-projects-c/nft/usernames/" + name1 + '.png'

        let path = window.location.pathname.indexOf('mstylelab') > -1 ? "mstylelab" : '1';
        let pdpurl =  window.location.origin + "/social/" + path + '/mynfts/username/' + name1;
        if (pdpurl.indexOf('localhost')> -1) {
            pdpurl = 'https://www.macys.com' + "/social/" + path + '/mynfts/username/' + name1;
        }
        // setFullImg("https://storage.googleapis.com/imp-projects-c/nft/usernames/" + name1 + '.png');

        // setPdp(pdpurl);
        window.pdp = pdpurl
        let url = `https://storage.googleapis.com/imp-projects-c/nft/usernameshtml/${name1 ? name1 : ""}.html`
        let geturl = async (url)=>{
            let shortened = await DataProvider.getData("https://nameclaim2-9b28e8781e6a.herokuapp.com/macysurlshortener?long_url="+url);
            if (shortened) {
                console.log(shortened.link);
                return shortened.link;
            } else {
                return url;
            }
        }

        if (t === 'tweet') {
          if (name1) {
              if (!window.short) {
                  geturl(url).then((data) => {
                      window.short = data;
                      if (!short) {
                          setShort(window.short)
                      }
                      return window.short;
                  })
              } else {
                  return window.short || short;
              }
          } else {
              if (!window.short) {
                  geturl(url).then((data) => {
                      window.short = data;
                      if (!short) {
                          setShort(window.short)
                      }
                      return window.short;
                  })
              } else {
                  return window.short || short;
              }
          }
        } else {
            if (!window.short) {
                geturl(url).then((data) => {
                    window.short = data;
                    if (!short) {
                        setShort(window.short)
                    }
                    return window.short;
                })
            } else {
                return window.short || short;
            }
        }
    }
  }

  const replaceURL = (e) => {
    if (e.currentTarget.href.indexOf('undefined')>-1) {
        // e.currentTarget.href = e.currentTarget.href.
    }
  }

  const onCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // const link = getLink();
    const link = window.pdp;
    copyToClipBoard(link);
    onCloseModal();
  }

  const handleClickOutside = (e) => {
    //console.log("resetting display of modal");
    onCloseModal()
  }

  const download = () => {

      if (doOnce) {
          console.log('download asset')
          doOnce = false;
          let iframe = document.getElementById('iframe') ? document.getElementById('iframe').contentWindow : window.parent;

          iframe.postMessage(
              {
                  sender: "download",
                  download: true
              },
              "*"
          );
      }
      return false;
  }

  return (
    <>
    {(showModal) &&
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2>Share</h2>

          <ul className={`${styles.ulwrap} ${getLink('tweet')||short ? "" : "disabled"}`}>
              <li><a target="_blank"
                        href={"//twitter.com/intent/tweet?text=" + ((nftMedia)? AltTwitterCopy : twitterCopy) + "&url=" + getLink('tweet')||short }><div className={styles.buttonInner}><IConTwitter /><span>Twitter</span></div></a></li>
              <li><a target="_blank"
                        href={"//www.facebook.com/sharer/sharer.php?u=" + getLink('tweet')||short + "?src=sdkpreparse"}><div className={styles.buttonInner}><IConFacebook /><span>Facebook</span></div></a></li>
              {!nftMedia && 
                <>
                  <li><a target="_blank"
                          onClick={download}><div className={styles.buttonInner}><IConDownload /><span>Download Image</span></div></a></li>
                  <li onClick={(e) => onCopy(e)}><div className={styles.buttonInner}><IConCopyLink /><span>Copy Image Link</span></div></li>
                </>}
          </ul>
        </div>
        <button className={styles.btnClose} onClick={onCloseModal}>
          <IconClose />
        </button>
      </div>
    }
    </>
  )
}