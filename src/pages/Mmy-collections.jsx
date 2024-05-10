import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Link from 'next/link';
import Head from '../components/Head';
import styles from './myCollectionsv2.module.scss';
import NFTListAlchemy from "../components/Collections/NFTListAlchemy.js";
import DigitalItem from "../components/Collections/DigitalItem";
import Loading from "../components/shared/Loading2";
import NFTs from "../web3/nft/NFTlib.js";
import {textEllipsisMid, getParameterByName} from '../utils/GlobalUtilities';
import WalletManager from "../components/WalletComponents/WalletManager.jsx";
import Picture from '../components/shared/Picture';
import DataProvider from "../utils/DataProvider";
import {setDigitalItems} from "../reducers/ApplicationSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//let runonce = true;
const contracts = require('../web3/SmartContracts/contracts.js');
let testaddresses = require('../web3/nft/testaddresses.js');

let asseturl = null;
if (typeof window !== "undefined") {
    asseturl = window.location.host.indexOf('localhost') > -1 ? "" : '//storage.googleapis.com/imp-projects-c/nft/build';
}

if (typeof window !== "undefined") {
    window.startMoralis = false;
}

function NotifyBar({ copy, color }) {
  return (
    <div className={`${styles.notifyBarContainer}`}>
      <div className={styles.notifyBar} style={{ backgroundColor: `${color}` }}>
        <Picture 
          desktop="icon-ox.svg"
        />
        <div className={styles.copy}>
          <p>{copy}</p>
        </div>
      </div>
    </div>
  );
}

export default function MyCollections() {
    const walletManager = useRef();
    const [isClient, setIsClient] = useState(false);
    const profileName = useSelector((state) => state.account.profileName);
    //const currentAccount = useSelector((state) => state.account.currentAccount);

    const wallets = useSelector((state) => state.account.wallets);
    const isLoggedIn = useSelector((state) => state.application.profileName);
    const attributes = useSelector((state) => state.application.attr);
    //const digitalItems = useSelector((state) => state.application.digitalItems); <------- Note not using this yet, calling db instead
    const [modalState, setModalState] = useState(false);
    //const [ethersnfts, setEthersNfts] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);
    const [alchemynfts, setAlchemynfts] = useState(null);
    const [profileNameItem, setProfileNameItem] = useState(null);
    const [digitalItemsSection, setDigitalItemsSection] = useState(null);
    const [coolcatsfigurine, setCoolcatsfigurine] = useState(null);
    const [coolcatstrophy, setCoolcatstrophy] = useState(null);
    const [profileNameTitle, setProfileNameTitle] = useState(null)
    const [pattern, setPattern] = useState(null);
    const [palette, setPalette] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [journee, setJournee] = useState(false)
    const [coolCats, setCoolCats] = useState({})
    const [figurine, setFigurine] = useState(false);
    const [trophy, setTrophy] = useState(false)

    const dispatch = useDispatch();
    const settings = {
      slidesToShow: 1.1,
      slidesToScroll: 1,
      draggable: true,
        infinite: false
    };

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 600);
    };

    let m3get = null;
    if (typeof window !== "undefined") {
        m3get = localStorage.getItem('m3get')
    }
    //const [getNFTs, setGetNFTs] = useState(m3get ? m3get : true);
    //let add = [];
    let wovenlist = [];


    let getCoolCats = () =>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": sessionStorage.getItem('m3ident') ? sessionStorage.getItem('m3ident') : sessionStorage.getItem('m3mreturninguser')
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        // let url = "https://web3servicesmcom.herokuapp.com";
        // if (window.location.hostname.indexOf('localhost') > -1) {
        //     url = "http://localhost:3005";
        // }
        let url = 'https://web3servicesmcom.herokuapp.com';
        if (window.location.host.indexOf('localhost')> -1) {
            url = 'http://localhost:3005';
        }
        if (window.location.host.indexOf('fds')> -1) {
            url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
        }

        fetch(url+"/users/getuser?fields=username,coolcatsitems,coolcats,journee", requestOptions)
            .then(async response => {
                let body = await response.json()
                console.log('coolcats in my collect',body )
                setCoolCats(body);
                if (body.coolcatsitems) {
                    console.log('coolcats: set trophy of figures',body.coolcatsitems)
                    if (body.coolcatsitems.indexOf('trophy') > -1 || body.coolcatsitems.flat().indexOf('trophy') > -1) {
                        console.log('coolcats: set trophy')
                        setTrophy(true)
                    }
                    if (body.coolcatsitems.indexOf('physical') > -1 || body.coolcatsitems.flat().indexOf('physical') > -1) {
                        console.log('coolcats: set figuine')
                        setFigurine(true)
                    }
                }
                if (body.journee) {
                    setJournee(body.journee);
                    getAt().then(function(a){
                        if (a) {
                            console.log('fgoe', a)
                            setPattern(a.pattern);
                            setPalette(a.palette)

                            let id = sessionStorage.getItem('profileName') || '0';

                            const item = (
                                <li className={styles.allNFTSItem}>
                                    <div className={styles.inner}>
                                        <Link href={`/mynfts/digitalitem/${id}`}>
                                            <DigitalItem id={sessionStorage.getItem('profileName') || id} attributes={{pattern:a.pattern, palette:a.palette, name: id}} />
                                            <div className={styles.allNftsItemInfo}>
                                                <div className={styles.allNftsItemTitle}>
                                                    mstylelab Digital Fashion
                                                </div>
                                                <p>/ 2023 Macy's mstylelab Collection</p>
                                            </div>
                                        </Link>
                                        <div className={styles.tryOn}>Try On My Avatar (Coming Soon)</div>
                                    </div>
                                </li>
                            )
                            if (localStorage.getItem('journee-collect')) {
                                console.log('journee1-1')
                                try {
                                    let collectibles = JSON.parse(localStorage.getItem('journee-collect'))
                                    if (collectibles.length > 6 && collectibles.indexOf('star_02') > -1) {
                                        setDigitalItemsSection(item);
                                    }
                                } catch(e){}
                            } else {
                                console.log('journee3-1', body.journee, attributes)
                                if (body.journee) {
                                    console.log('journee2-1', body.journee)
                                    let collectibles = body.journee.collectibles;
                                    localStorage.setItem('journee-collect', JSON.stringify(collectibles));
                                    if (collectibles.length > 6 && collectibles.indexOf('star_02') > -1) {
                                        setDigitalItemsSection(item);
                                    }
                                }
                            }
                        }
                    });



                }
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    let getTestAddresses = function(){
      let addresses = [];
      return new Promise(function(resolve, reject){
          if (window.location.search) {
            /*
              if (window.location.hostname.indexOf('localhost') > -1) {
                  add = add.concat(testaddresses).filter(onlyUnique);
              } else*/
              if (window.location.search.indexOf('devmode') > -1) {
                addresses = testaddresses.filter(onlyUnique);
                // console.log(' getAddresses devmode',add)

                resolve(addresses)
              } else if (window.location.search.indexOf('wallet') > -1) {
                  addresses = []
                  
                  addresses.push(getParameterByName('wallet', window.location.href));
                  console.log(' got address from querystring ', addresses)

                  resolve(addresses);
              } else if ( sessionStorage.getItem('m3ids') ) {
                  try {
                      if (sessionStorage.getItem('m3ids').indexOf('macys_fgender_email@yahoo.com') > -1) {
                          addresses = testaddresses.filter(onlyUnique);
                          // console.log(' getAddresses fged1', add)
                          resolve(addresses)
                      } else {
                          resolve(addresses)
                      }
                  } catch(e){
                      resolve(addresses)
                  }
              } else {
                  resolve(addresses)
              }
          }
      })
    }

    const getNFTSEthers2 = async (uAdd) => {
      console.log("Attempting to load NFTs with addresses: ", uAdd)
        let promises = []
        uAdd.forEach(function(address,i){
            promises.push(NFTs.alchemy(address, contracts, i));
        })

        Promise.all(promises).then(function(v){
            let all = [];
            v.forEach((o)=>{
                all = all.concat(o)
            })
            console.log('my-collections: Loaded all NFTS! ');
            sessionStorage.setItem("alchemy",JSON.stringify(all));
            setAlchemynfts(all);
        })
        
    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    function swapWalletAddresses(address) {
      switch(address) {
        case '0x6eacc0be6a3fbe3a68d5b02395fe163100270442':
          // switch Macy's default with virtual pass user
          return '0xa6766e0e6C72895040aD2b0308E8959e413Df04e'
        case '0xacc44e9619dc66c361a57e3cedc12ab10b2fc798':
          // switch Metamask with oncyber user
          return '0x42b6268308947d66b77979536a07605fb489a9de'
        case '0xbfaeef00211500961b850554c9e63cbf51d15960':
          // switch Coinbase with Keith's
          return '0xB2E42121aB7d60da69C46172D16F0151a3b88e1B'
        default: return address
      }
    }

    let getAt = (async() => {
        // let url = 'https://web3servicesmcom.herokuapp.com';
        // if (window.location.host.indexOf('localhost') > -1) {
        //     url = 'http://localhost:3005';
        // }
        let url = 'https://web3servicesmcom.herokuapp.com';
        if (window.location.host.indexOf('localhost')> -1) {
            url = 'http://localhost:3005';
        }
        if (window.location.host.indexOf('fds')> -1) {
            url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
        }
        let user = sessionStorage.getItem('profileName') ? sessionStorage.getItem('profileName') : profileName;
        if (user) {
            if (sessionStorage.getItem('profileName') || profileName) {
                let getAttr = await DataProvider.getData(`${url}/users/usernameattr?username=${sessionStorage.getItem('profileName') ? sessionStorage.getItem('profileName') : profileName}`);
                console.log(getAttr, 'getAttr');
                return getAttr;
            } else {
                return {}
            }
        }
    })

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
      let profName = sessionStorage.getItem('profileName')

      if (attributes) {
          setPattern(attributes.pattern);
          setPalette(attributes.palette)
      } else {
          getAt().then(function(a){
              if (a) {
                  console.log('fgoe', a)
                  setPattern(a.pattern);
                  setPalette(a.palette)
              }
          });
      }
      console.log("my-collections: attributes? ", attributes)
      if (profName || profileName) {
          let name = profileName? profileName : profName;
          setProfileNameTitle(name);

          let p = [
            <li className={styles.allNFTSItem} key={"user"+Math.random()}>
                <div className={styles.inner}>
                    <Link href={`/mynfts/username/${name}`}>
                        <div className={styles.allNftsListItemMedia} style={{'backgroundImage': `https://storage.googleapis.com/imp-projects-c/nft/usernames/${name}.png`}}>
                            {/*//save in case */}
                            {pattern ? <iframe
                                src={`//storage.googleapis.com/imp-web3/nft/final-prototype2/index.html?${animation()}&name=${name}&pattern=${pattern ? pattern : 6}&palette=${palette || palette === 0 ? palette : 5}&hideGui&puppeteer&hideTool&fov=80`}
                                frameBorder={"none"}
                                scrolling="no"
                                width={window.innerWidth > 768 ? "688" : window.innerWidth}
                                height={window.innerWidth > 768 ? "688" : window.innerWidth}
                            /> : null }

                            {/*<object className={styles.object} data={'https://storage.googleapis.com/imp-projects-c/nft/usernames/'+name+'-bg.png'} type="image/png">*/}
                            {/*    <img src={'https://storage.googleapis.com/imp-projects-c/nft/usernames/'+name+'.png'}/>*/}
                            {/*</object>*/}
                        </div>
                    </Link>
                </div>
                <div className={styles.allNftsItemInfo}>
                    <div className={styles.allNftsItemTitle}>
                        mstylelab Digital Fashion
                    </div>
                    <p>/ 2023 Macy's mstylelab Collection</p>
                </div>
            </li>
          ]
          wovenlist.push(p);
          setProfileNameItem(wovenlist)
        }
    }, [profileName, attributes, palette, pattern]);

    useEffect(() => {
        setIsClient(true);
        let add, wallet
        // looping through the loaded wallets array from db and grabbing their addresses
        try {
          if (wallets.length > 0) {
            console.log("my-collections: global state wallets ", wallets)
            add = wallets.map(function(e) {
              //wallet = swapWalletAddresses(e.address)
              //return wallet;
              return e.address
            });
          } else if (isLoggedIn) {
             add = JSON.parse(sessionStorage.getItem('m3mwallets')).wallets.map(function(e) {
                console.log("my-collections: sessionStorage m3mwallets! ", sessionStorage.getItem('m3mwallets'));
                return e.address;
            });
          }

          setUserAddresses([...add, ...userAddresses].filter(onlyUnique));
        } catch(e){}
    }, [wallets]);

    useEffect(() => {
      if (alchemynfts) console.log('NFTs ??? ', alchemynfts)
    }, [alchemynfts]);



    useEffect(() => {
      //if (digitalItems) {
        console.log("My-Collections: received parameters ")

        getAt().then(function(a){
          if (a) {
              console.log('fgoe', a)
              // setPattern(a.pattern);
              // setPalette(a.palette)

              let id = sessionStorage.getItem('profileName') || '0';
              // let path = window.location.pathname.split('/').filter((o)=>{ return o });
              // if (id !== path[path.length-1]) {
              //     id = path[path.length-1];
              // }
              // const id = sessionStorage.getItem('profileName') || '0';
              const item = (
                  <li className={styles.allNFTSItem}>
                    <div className={styles.inner}>
                      <Link href={`/mynfts/digitalitem/${id}`}>
                        <DigitalItem id={sessionStorage.getItem('profileName') || id} attributes={{pattern:a.pattern, palette:a.palette, name: id}} />
                        <div className={styles.allNftsItemInfo}>
                          <div className={styles.allNftsItemTitle}>
                              mstylelab Digital Fashion
                          </div>
                          <p>/ 2023 Macy's mstylelab Collection</p>
                        </div>
                      </Link>
                      <div className={styles.tryOn}>Try On My Avatar (Coming Soon)</div>
                    </div>
                  </li>
              )
              if (localStorage.getItem('journee-collect')) {
                  console.log('journee1')
                  try {
                      let collectibles = JSON.parse(localStorage.getItem('journee-collect'))
                      if (collectibles.length > 6 && collectibles.indexOf('star_02') > -1) {
                          setDigitalItemsSection(item);
                      }
                  } catch(e){}
              } else {
                  console.log('journee3', journee)
                  if (journee) {
                      console.log('journee2', journee)
                      let collectibles = journee.collectibles;
                      localStorage.setItem('journee-collect', JSON.stringify(collectibles));
                      if (collectibles.length > 6 && collectibles.indexOf('star_02') > -1) {
                          setDigitalItemsSection(item);
                      }
                  }
              }
          }
        });

        /* 
          TEST Cool Cats ONLY 
        */
       if (true) {
        if (true) {
          console.log('My-Collections: trophy: ??? ')
          const item = (
            <li className={styles.allNFTSItem}>
              <div className={styles.inner}>
                <Link href={`/mynfts/digitalCollectible/trophy`}>
                  <div className={styles.digitalItemContainer}>
                    <img src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcatstrophy.jpg'} />
                  </div>
                  <div className={styles.allNftsItemInfo}>
                      <div className={styles.allNftsItemTitle}>
                        Macy’s Thanksgiving Day Parade® Digital Art Trophy
                      </div>
                      <p>/ Macy’s Digital Collectibles</p>
                  </div>
                </Link>
              </div>
            </li>
          )
          setCoolcatstrophy(item);
        }
        
        if (true) {
          console.log('My-Collections: figurine: ??? ')
          const item2 = (
            <li className={styles.allNFTSItem}>
              <div className={styles.inner}>
                <Link href={`/mynfts/digitalCollectible/figurine`}>
                  <div className={styles.digitalItemContainer}>
                    <img src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/coolcatsfigurine.jpg'} />
                  </div>
                  <div className={styles.allNftsItemInfo}>
                      <div className={styles.allNftsItemTitle}>
                        Color Me Cool Design & Share Figurine
                      </div>
                      <p>/ Macy’s Digital Collectibles</p>
                  </div>
                </Link>
              </div>
            </li>
          )
          setCoolcatsfigurine(item2);
        }
       }


    }, []);

    useEffect(() => {
        let email = sessionStorage.getItem('m3ident') ? sessionStorage.getItem('m3ident') : sessionStorage.getItem('m3mreturninguser')
        if (email) {
            if (email !== 'null') {
                getCoolCats();
            }
        }
        let params = new URLSearchParams(window.location.search);

        if (params.get('fromTrophy')) { // for case when the db hasnt finished writing item yet (refrsh will show trophy)
            setTrophy(true)
        }
    },[])

    useEffect(() => {
        try {
            if (coolCats.coolcatsitems.flat().indexOf('trophy') > -1 || coolCats.coolcatsitems.indexOf('trophy') > -1 || coolCats.coolcats == 'game') {
                setTrophy(true)
                // console.log('trophy------')
            }
        } catch(e){}
        try {
            if (coolCats.coolcatsitems.indexOf('physical') > -1 || coolCats.coolcats == 'amex') {
                setFigurine(true);
                // console.log('setFigurine------')
            }
        } catch(e){}
    },[coolCats])

    useEffect(() => {
      // reminder userAdress get updated whenever a wallet is added via ConnectrWalletModal
      if (userAddresses.length > 0) {
        console.log("my-collections: addresses updated! gettingNFTEthers?")
        getNFTSEthers2(userAddresses);
        localStorage.setItem('m3get', false);
        //setGetNFTs(false);

      }
    }, [userAddresses]);


    useEffect( () => {
      // console.log(attributes, 'do we have attr', pattern, palette)

      try {
        console.log("my-collections: checking for devmode")
          getTestAddresses().then(function(sa){
              console.log('my-collections: get test addresses ', sa);
                              
              setUserAddresses([...sa, ...userAddresses].filter(onlyUnique));
          });
      } catch(e){
      }

      updateViewport(); // Initial check
      window.addEventListener("resize", updateViewport); // Attach listener

      return () => {
          window.removeEventListener("resize", updateViewport); // Clean up listener
      };
    }, []);

    const onAddWallet = (e) => {
      //setModalState(true);
      walletManager.current.openConnectWalletModal()
    }

    const onClose = () => {
      setModalState(false);
    }

    return (
        <>
        <Head title="Macy's STYL - My Collections"/>
        <div className={styles.collectionsFrame}>
          <div className={styles.collectionsPanels}>
            <div className={styles.collectionsContent}>
              <div className={styles.heading}>
              {profileNameTitle?
                <NotifyBar copy={profileNameTitle + ".mstylelab"} className="profile" color="#ffffff" />
                :
                <NotifyBar copy={"Profile"}  color="#ffffff" />}
              </div>
              
              
              <div className={styles.collection}>

                {/* Load all Digital Collectibles here */}
                {(trophy || figurine) && <div className={styles.digitalItems}>
                  <hr/>
                    <h2>Macy's Digital Collectibles</h2>
                  <hr/>
                  <div>
                      {/*test {coolCats.coolcatsitems.indexOf('trophy') > -1}*/}
                      {(isMobile && trophy && figurine)?
                      <ul>
                        <Slider {...settings}>
                          {coolcatstrophy}
                          {coolcatsfigurine}
                        </Slider>
                      </ul>
                      :
                      <ul>
                        {trophy ? coolcatstrophy : null}
                        {figurine ? coolcatsfigurine : null}
                      </ul>}
                  </div>
                </div>}

                {/* Load all Digital items here */}
                <div className={styles.digitalItems}>
                  <hr/>
                    <h2>Mstylelab Digital Fabric</h2>
                  <hr/>
                  <div>
                    {(isMobile && profileNameItem && digitalItemsSection )?
                      <ul>
                        <Slider {...settings}>
                          {profileNameItem}
                          {digitalItemsSection}
                        </Slider>
                      </ul>
                      :
                      <ul>
                        {profileNameItem}
                        {digitalItemsSection}
                      </ul>}
                  </div>
                </div>
                
                {/* Load all NFT collections here */}
                {(alchemynfts && alchemynfts.length > 0)?
                  <>
                    <div className={styles.digitalCollection}>
                        <hr/>
                        <h2>Macy's Digital Collectibles</h2>
                        <hr/>
                        
                        <NFTListAlchemy nfts={alchemynfts} category={'all'} />
                    </div>
                    <hr/>
                  </>
                  :
                  (isLoggedIn)? <div className={styles.loaderContainer}>
                                    <Loading isShowing={true}/>
                                  </div>
                                  :
                                  null
                }
              </div>
              
              {/* Adding wallets sections */}
              <div className={styles.walletConnect}>
                <div className={styles.walletConnectImage}>
                  <Picture
                    desktop="groupNFTs.jpg"
                    mobile="groupNFTs.jpg"
                  ></Picture>
                </div>
                <div className={styles.walletConnectCopy}>
                  <h1>Hold any Macy's <br /> NFTs?</h1>
                  <p>Connect your digital addresses to showcase your digital items in one place.</p>
                  <button onClick={onAddWallet}>Connect Digital Addresses</button>
                  
                  
                </div>
                <div className={styles.iconHolder}><img src={'https://storage.googleapis.com/imp-projects-c/nft/assets2/images/profile-folder.png'} /></div>
              </div>

              <WalletManager ref={walletManager} show={false} />

            </div>
          </div>
        </div>
      </>
    )
}