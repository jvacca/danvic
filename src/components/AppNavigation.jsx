import React, {useState, useRef} from 'react'
import Image from 'next/image';
import Link from "next/link";

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
  //const isLoggedIn = useSelector((state) => state.application.isLoggedIn);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const modal = useRef()
  const dropdown = useRef()

  const onLogout = () => {
    setIsLoggedIn(false)
  }

  const options = [
      {
        id: 0,
        type: 'link',
        icon: <Image src={IconProfileSrc} alt="profle" />,
        label: 'profile',
        route: '/profile'
      },
      {
        id: 1,
        type: 'link',
        icon: <IconSettings />,
        label: 'settings',
        route: '/settings'
      },
      {
        id: 2,
        type: 'button',
        icon: <IconLogOut />,
        label: 'logout',
        onclick: onLogout
      }
    ]

  const handleSignin = () => {
    modal.current.openModal()
  }

  const onLoggedIn = () => {
    setIsLoggedIn(true)
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
            <Link href="/dashboard">Dashboard</Link> |
            <Link href="/wallets">Wallets</Link> |
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