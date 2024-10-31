import Head from '@/components/Head'
import Image from 'next/image'
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import styles from '@/components/Home/Home.module.scss'

export default function Home() {
  const isLoggedIn = useSelector((state) => state.application.isLoggedIn)
  const profileName = useSelector((state) => state.account.profileName)

  return (
    <>
      <Head />
      <main className={styles.main}>
        {isLoggedIn?
          <div className={styles.intro}>
            <h1>Welcome back {profileName? profileName : '[User Name]'} </h1>
            <h3>Menu:</h3>
            <p>Dashboard: Checkout what NFTs are in your wallet</p>
            <Link href='/profile/dashboard'>Check out My Dashboard</Link>
            <p>Wallets: Checkout what wallets are connected or start adding wallets</p>
            <Link href='/profile/wallet'>Check out My Wallets</Link>
          </div>
        :
        <>
          <div className={styles.intro}>
            <h3>Welcome to </h3>
            <h1>Web3 Wallets</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>

          <div className={styles.signup}>
          <h1>Get Started</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <Link href="/register">Sign Up Now</Link>
          </div>
        </>}
      </main>
    </>
  )
}
