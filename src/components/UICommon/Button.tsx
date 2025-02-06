import React from 'react'
import styles from './Button.module.scss'

type ButtonProps = {
  classname?: string
  onclickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  children: React.ReactNode
}

export default function Button({classname, onclickHandler, disabled, children}: ButtonProps): React.ReactNode {
  return (
    <button className={`${styles["container"]} ${classname}`} onClick={onclickHandler} disabled={disabled? disabled : false}>{children}</button>
  )
}