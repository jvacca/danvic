import React, {useState} from 'react'
import Image from 'next/image';
import Link from "next/link";

import ProfilePicSrc from '../../public/images/profilePic.png'
import logoSrc from '../../public/images/icons8-card-wallet-94.png'

import styles from './AppNavigation.module.scss'

export default function AppNavigation() {
  //const isLoggedIn = useSelector((state) => state.application.isLoggedIn);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSignin = () => {
    setIsLoggedIn(true)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <Image
          alt="logo"
          src={logoSrc}
          width="30"
        ></Image>
        <span>Web3 Wallets</span>
      </div>
      
    {isLoggedIn?
      <nav>
        <Link href="/dashboard">Dashboard</Link> |
        <Link href="/wallets">Wallets</Link> |
        <Link href="/profile"><Image src={ProfilePicSrc} alt="profile pic" /> ataribro</Link>
      </nav>
      :
      <button onClick={handleSignin}>Sign in</button>
    }
    </div>
  )
}