import React from 'react'
import Image from 'next/image'
import githubSrc from '../../public/images/icons8-github-logo-24.png'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <p>&copy; 2024 John Vacca &nbsp; <a href='/terms'>Terms</a> &nbsp;&nbsp; <a href='/privacy'>Privacy</a> <a href="https://github.com/jvacca" target="_blank"><Image src={githubSrc} alt="github logo" /> jvacca</a></p>
    </div>
  )
}