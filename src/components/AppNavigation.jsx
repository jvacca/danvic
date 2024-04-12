import React, {useState, useRef} from 'react'
import Image from 'next/image';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  updateIsLoggedIn
} from "../reducers/ApplicationSlice";
import Button from './UICommon/Button'
import Modal from './UICommon/Modal'
import Signin from './Signin/Signin'
import DropDown from './UICommon/DropDown'

import IconLogiIn from '../assets/icon-signin.svg'
import IconLogOut from '../assets/icon-logout.svg';
import IconSettings from '../assets/icon-settings-black.svg'
import IconProfileSrc from '../../public/images/icon-profile.png'

import ProfilePicSrc from '../../public/images/profilePic.png'
import logoSrc from '../../public/images/icons8-card-wallet-94.png'

import styles from './AppNavigation.module.scss'

export default function AppNavigation() {
  const isLoggedIn = useSelector((state) => state.application.isLoggedIn)
  const modal = useRef()
  const dropdown = useRef()
  const dispatch = useDispatch()

  const onLogout = () => {
     dispatch(updateIsLoggedIn(false))
  }

  const options = [
      {
        id: 0,
        type: 'link',
        icon: <Image src={IconProfileSrc} alt="profle" />,
        label: 'Dashboard',
        route: '/my-dashboard'
      },
      {
        id: 0,
        type: 'link',
        icon: <Image src={IconProfileSrc} alt="profle" />,
        label: 'Wallets',
        route: '/my-wallets'
      },
      {
        id: 1,
        type: 'link',
        icon: <IconSettings />,
        label: 'Settings',
        route: '/settings'
      },
      {
        id: 2,
        type: 'button',
        icon: <IconLogOut />,
        label: 'Log out',
        onclick: onLogout
      }
    ]

  const handleSignin = () => {
    modal.current.openModal()
  }

  const onLoggedIn = () => {
    dispatch(updateIsLoggedIn(true))
    modal.current.closeModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <Link href='/' className={styles.logo}>
            <Image
              alt="logo"
              src={logoSrc}
              width="30"
            ></Image>
            <span>Web3 Wallets</span>
          </Link>
          
        {isLoggedIn?
          <nav>
            <Link href="/faqs">FAQs</Link> |
            <Link href="/about">About</Link> |
            <DropDown ref={dropdown} data={options} triggerIcon={ProfilePicSrc} />
          </nav>
          :
          <Button onclickHandler={handleSignin}>Sign in</Button>
        }
        </div>
      </div>
      
      <Modal ref={modal}>
        <Signin onAuthenticated={onLoggedIn} />
      </Modal>
    </>
  )
}