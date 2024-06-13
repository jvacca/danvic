import React, {useEffect, useRef} from 'react'
import Image from 'next/image';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '@/store'
import {
  updateAccount,
  updateUserId,
  updateProfileName,
  updateDefaultWallet,
  updateWalletStatus,
  updateProfileData
} from "@/reducers/AccountSlice";
import {
  updateIsLoggedIn,
  updateIsReturningUser,
  setOpenModal
} from "@/reducers/ApplicationSlice";
import Button from '../UICommon/Button'
import Modal, {ModalHandlers} from '../UICommon/Modal'
import Signin from '../Signin/Signin'
import FlyoutMenu, {FlyoutMenuHandlers} from '../UICommon/FlyoutMenu'

import IconLogiIn from '@/assets/icon-signin.svg'
import IconLogOut from '@/assets/icon-logout.svg';
import IconSettings from '@/assets/icon-settings-black.svg'
import IconProfileSrc from '../../../public/images/icon-profile.png'

import ProfilePicSrc from '../../../public/images/profilePic.png'
import logoSrc from '../../../public/images/icons8-card-wallet-94.png'
import useAsyncLoad from "@/hooks/useAsyncLoad";
import useWalletStateSync from "@/hooks/useWalletStateSync";
import styles from './Header.module.scss'
import { Url } from 'next/dist/shared/lib/router/router';

interface OptionInterface {
  id: number,
  type: string,
  icon?: React.ReactNode,
  label: string,
  route?: Url,
  onclick?: () => void
}

export default function AppNavigation(): React.ReactNode {
  const isLoggedIn = useSelector((state: RootState) => state.application.isLoggedIn)
  const loadUserData = useAsyncLoad();
  const { loadWalletDataToStates } = useWalletStateSync();
  const modal = useRef<ModalHandlers>(null)
  const flyoutMenu = useRef<FlyoutMenuHandlers>(null)
  const dispatch: AppDispatch = useDispatch()

  const onLogout = () => {
     dispatch(updateIsLoggedIn(false))
  }

  const options: OptionInterface[] = [
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
  
  const handleLoadUserData = () => {
    loadUserData('mockLoadUser').then((data) => {
      console.log("Header: Got user settings -----", data)

      dispatch(updateUserId(data.userid));
      try { // putting in try catch for public view username PDP
        dispatch(updateProfileName(data.username));
      } catch(e){}
      dispatch(updateDefaultWallet(data.default_wallet));
      loadWalletDataToStates(data.wallets);
      dispatch(updateProfileData(data));
      dispatch(updateWalletStatus({ which: "macys", value: true }));
      dispatch(
          updateAccount({
            address: data.default_wallet.address,
            network: "0x1",
            wallet: "macys",
            balance: null
          })
      );

      dispatch(updateIsLoggedIn(true) as any);
      dispatch(updateIsReturningUser(true));
    })
  }

  const handleSignin = () => {
    if (modal.current) {
      modal.current.openModal();
    }
  }

  const onLoggedIn = () => {
    dispatch(updateIsLoggedIn(true))
    if (modal.current) {
      modal.current.closeModal()
    }

    handleLoadUserData()
  }

  const onClose = () => {
    if (modal.current) {
      modal.current.closeModal()
    }
    if (flyoutMenu.current) {
      flyoutMenu.current.closeMenu()
    }
  }

  useEffect(() => {
    document.addEventListener('click', () => {
      if (flyoutMenu.current) {
        flyoutMenu.current.closeMenu()
      }
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
          <Link href="/" passHref>Home</Link> |
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
                  {(option.type === 'link')? <Link href={option.route || '/'} onClick={onClose}>{option.label}</Link> : null}
                  {(option.type === 'button')? <a onClick={option.onclick} target='_blank'>{option.label}</a> : null}
                </li>
              ))}
              </ul>
            </FlyoutMenu.List>
          </FlyoutMenu>
          :
          <>
            <Button classname={styles.signin} onclickHandler={handleSignin} disabled={false}>Sign in</Button>
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