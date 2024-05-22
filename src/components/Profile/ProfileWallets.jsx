// React imports
import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useDispatch } from 'react-redux'
import {updateWallets} from '../../reducers/AccountSlice'

import Modal from '../UICommon/Modal'
import WalletManager from '../WalletComponents/WalletManager'
import styles from '../../pages/profile/profile.module.scss'
//import data from '@/mockdata/wallets.json'

export default function ProfileWallets ({profileData}) { 
  const walletManager = useRef()
  const modal = useRef()
  const dispatch = useDispatch()

  const WalletModalCopy = {
    title: "Wallets",
    body: "A wallet is a safe, secure app created to store and manage virtual assets."
  }
  const handleOpenModal = () => {
    modal.current.openModal()
  }

  return (
    <>
      <div className={styles.walletsPanel}>
        <div className={styles.desktop}>
          <h2>Manage Wallets</h2>
          {(profileData)?
          <>
            <p>Link additional <a onClick={handleOpenModal}>wallets</a> to showcase all your NFTs in one place.</p>
            <h3>Linked Wallets</h3>
            <WalletManager ref={walletManager} show={true} />
          </>
          :
          <>
            Please Log in first
          </>}
        </div>
        <Modal ref={modal}>
          <h2>{WalletModalCopy.title}</h2>
          <p>{WalletModalCopy.body}</p>
        </Modal>
      </div>
      <div className={styles.mobile}>
        To manage your digital wallet, please go to our desktop site.
      </div>
    </>
  )
}