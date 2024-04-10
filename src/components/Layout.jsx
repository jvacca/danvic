import React from 'react'
import Head from './Head'
import AppNavigation from '@/components/AppNavigation'
import Footer from '@/components/Footer'

export default function Layout({children}) {
  return (
    <>
      <AppNavigation />
        {children}
      <Footer />
    </>
  )
}
