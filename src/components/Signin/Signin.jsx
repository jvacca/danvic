import React, {useRef, useState} from 'react'
import Link from 'next/link'
import Button from '../UICommon/Button'
import styles from './Signin.module.scss'
export default function Signin({onAuthenticated, onClose}) {
  const emailRef = useRef()
  const passwordRef = useRef()

  const onSubmit = () => {
    onAuthenticated()
  }

  return (
    <div className={styles.wrapper}>
      <h2>Sign in</h2>
      <p>Please enter your email and password</p>
      <input ref={emailRef} type="text" placeholder="Email address" />
      <input ref={passwordRef} type="text" placeholder="password" />
      <Button classname={styles.signin} onclickHandler={onSubmit}>Submit</Button>

      <p>Not signed up? Register <Link onClick={onClose} href={'/register'}>here</Link>.</p>
      <p>Forgot password? Go <Link onClick={onClose} href={'/change-password'}>here</Link>.</p>

      <p className={styles.legalLinks}>
        <Link href='/privacy'>Privacy</Link> | <Link href="/terms">Terms</Link>
      </p>
    </div>
  )
}