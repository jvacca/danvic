import React, {useEffect, useRef} from 'react'
import Image from 'next/image';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  updateIsLoggedIn
} from "../../reducers/ApplicationSlice";
import Button from '../UICommon/Button'
import Modal from '../UICommon/Modal'
import Signin from '../Signin/Signin'
//import DropDown from '../UICommon/DropDown'
import FlyoutMenu from '../UICommon/FlyoutMenu'

import IconLogiIn from '@/assets/icon-signin.svg'
import IconLogOut from '@/assets/icon-logout.svg';
import IconSettings from '@/assets/icon-settings-black.svg'
import IconProfileSrc from '../../../public/images/icon-profile.png'

import ProfilePicSrc from '../../../public/images/profilePic.png'
import logoSrc from '../../../public/images/icons8-card-wallet-94.png'

import styles from './Header.module.scss'

export default function AppNavigation() {
  const isLoggedIn = useSelector((state) => state.application.isLoggedIn)
  const modal = useRef()
  const flyoutMenu = useRef()
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
        route: '/profile/dashboard'
      },
      {
        id: 1,
        type: 'link',
        icon: <Image src={IconProfileSrc} alt="profle" />,
        label: 'Wallets',
        route: '/profile/wallet'
      },
      {
        id: 2,
        type: 'link',
        icon: <IconSettings />,
        label: 'Settings',
        route: '/profile/settings'
      },
      {
        id: 3,
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

  const onClose = () => {
    modal.current.closeModal()
    flyoutMenu.current.closeMenu()
  }

  useEffect(() => {
    document.addEventListener('click', () => {
      flyoutMenu.current?.closeMenu()
    });
    return () => {
      document.removeEventListener('click', () => {});
    }
  }, [])

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
          
        <nav>
          <Link href="/">Home</Link> |
          <Link href="/faqs">FAQs</Link> |

        {isLoggedIn?
          <FlyoutMenu ref={flyoutMenu} classname={styles.profileMenu}>
            <FlyoutMenu.Toggle id={'main'} classname={styles.profileToggle}>
              <Image src={ProfilePicSrc} alt="trigger icon" />
            </FlyoutMenu.Toggle>
            <FlyoutMenu.List classname={styles.profileList}>
              <ul>
              {options?.map((option) => (
                <li key={option.id}>
                  {option.icon? option.icon : null}
                  {(option.type === 'link')? <Link href={option.route} onClick={onClose}>{option.label}</Link> : null}
                  {(option.type === 'linkout')? <a href={option.url} onClick={onClose} target='_blank'>{option.label}</a> : null}
                  {(option.type === 'button')? <a onClick={option.onclick} target='_blank'>{option.label}</a> : null}
                </li>
              ))}
              </ul>
            </FlyoutMenu.List>
          </FlyoutMenu>
          :
          <>
            <Button classname={styles.signin} onclickHandler={handleSignin}>Sign in</Button>
          </>}
          </nav>
        </div>
      </div>
      
      <Modal ref={modal}>
        <Signin onAuthenticated={onLoggedIn} onClose={onClose} />
      </Modal>
    </>
  )
}