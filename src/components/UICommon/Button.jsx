import React from 'react'
import styles from './Button.module.scss'

export default function Button({classname, onclickHandler, disabled, children}) {
  return (
    <button className={`${styles["container"]} ${classname}`} onClick={onclickHandler} disabled={disabled? disabled : false}>{children}</button>
  )
}