import React from 'react'
import Image from 'next/image'
import Link from "next/link";
import githubSrc from '../../../public/images/icons8-github-logo-24.png'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <p>&copy; 2024 John Vacca &nbsp; <Link href='/terms'>Terms</Link> &nbsp;&nbsp; <Link href='/privacy'>Privacy</Link> <Link href="https://github.com/jvacca" target="_blank"><Image src={githubSrc} alt="github logo" /> jvacca</Link></p>
    </div>
  )
}