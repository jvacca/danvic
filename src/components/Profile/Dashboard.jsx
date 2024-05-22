import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Image from 'next/image';
import WalletScanner from '../WalletComponents/WalletScanner.jsx'
import styles from './profile.module.scss';
import styles2 from '@/components/WalletComponents/WalletScanner.module.scss';
import ProfilePicSrc from '../../../public/images/profilePic.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PDPThumb from "@/pages/mynfts/[contractid]/PDPThumb";

export default function Dashboard({profileData}) {
  const walletManager = useRef();

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    dots: true
  };

  //const profileName = useSelector((state) => state.account.profileName);
  //const profileData = useSelector((state) => state.account.profileData);
  const [profileNameTitle, setProfileNameTitle] = useState(null)

  useEffect(() => {
    let profName = sessionStorage.getItem('profileName')

    if (profName || profileData?.username) {
        let name =  profileData?.username?  profileData.username : profName;
        setProfileNameTitle(name);
    }
  }, [profileData])

  return (
      <>
      <div className={styles.collectionsFrame}>
        <div className={styles.collectionsPanels}>
        {(profileData)?
          <div className={styles.collectionsContent}>
            <h2>Dashboard for: {profileData.username}</h2>
              <div className={styles.profileImage}>
                <Image src={ProfilePicSrc} alt="trigger icon" />
              </div>
              {/* Example of render props  */}
              <WalletScanner 
                render={(nfts, currentAccount) => (
                  (nfts.length < 4)?
                    <ul className={styles2.nonslider}>
                      {nfts && nfts.map(nft => <PDPThumb key={nft.title} nft={nft} network={currentAccount.network} />)}
                    </ul>
                    :
                    <ul>
                      <Slider {...settings}>
                      {nfts && nfts.map(nft => (
                        <PDPThumb key={nft.title} nft={nft} network={currentAccount.network} />
                      ))}
                      </Slider>
                    </ul>
                )}
              />
          </div>
          :
          <>
            Please Log in first
          </>}
        </div>
      </div>
      </>
  )
}