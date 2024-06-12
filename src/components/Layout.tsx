import React from 'react'
import Head from './Head'
import Header from '@/components/AppNavigation/Header'
import Footer from '@/components/AppNavigation/Footer'
import styles from './Layout.module.scss'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
        <div className={styles.frame}>
          {children}
        </div>
      <Footer />
    </>
  )
}
