// React imports
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSelector } from 'react-redux';

import GenericModal from '../UICommon/Modal';
import WalletManager from '../WalletComponents/WalletManager';
import styles from '../../pages/profile/profile.module.scss';

export default function ProfileWallets () { 
  const [genericModalState, setGenericModalState] = useState(false);
  const walletManager = useRef();

  const macysWalletModalCopy = {
    title: "Digital address",
    body: "A digital address is a safe, secure app created to store and manage virtual assets. Yours is operated and managed by Magic, a third-party wallet provider. Please note: your mstylelab digital address is specifically designed for Macy’s Collectibles and Macy’s mstylelab digital creations, and it does not currently support sending or receiving other digital assets. <br/><br/> Questions? Need support? Email hello@magic.link or review Magic’s <a href='https://magic.link/legal/terms-of-service' target='_blank'>Terms and Conditions.</a>"
  }

  const onShowMacysModal = (e) => {
    setGenericModalState(true);
  }

  const onCloseMacysModal = (e) => {
    setGenericModalState(false);
  }

  return (
    <>
      <div className={styles.walletsPanel}>
        <div className={styles.desktop}>
          <h2>Manage digital address</h2>
          <p>mstylelab is automatically set as your default <a onClick={onShowMacysModal}>digital address</a>. Link additional digital addresses to showcase all your Macy’s collectibles in one place.</p>
            <h3>Linked digital addresses</h3>
            <WalletManager ref={walletManager} show={true} />
        </div>
        <GenericModal onCloseModal={onCloseMacysModal} showModal={genericModalState} copy={macysWalletModalCopy} />
        {/*<WalletScanner isDisplay={true} />*/}
      </div>
      <div className={styles.mobile}>
        To manage your digital wallet, please go to our desktop site.
      </div>
    </>
  )
}