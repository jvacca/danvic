import React, { useState, forwardRef, useRef, useImperativeHandle, useContext } from "react";
import styles from './FlyoutMenu.module.scss';
import {FlyoutContext} from '../WalletComponents/WalletManager'

 // eslint-disable-next-line react/display-name
 const FlyoutMenu = forwardRef(({id, children}, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      closeMenu() {
        setOpen(false)
      }
    }
  })

  return (
    <div className={styles.FlyoutMenu}>
      {React.Children.map(children, (child) => (
        React.cloneElement(child, {open, setOpen})
      ))}
    </div>
  )
})

function Toggle({id, children, open, setOpen}) {
  const flyoutListner = useContext(FlyoutContext);
  const toggleMenu = (e) => {
    e.stopPropagation()
    setOpen(!open)

    if (open === false) flyoutListner(id)
  }

  return (
    <button className={styles.FlyoutMenuToggle} onClick={(e) => toggleMenu(e)}>{children}</button>
  )
}

function List({children, open}) {
  return (
    open && 
    <div className={styles.FlyoutMenuList}>
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
        <ul className={styles.cmList}>
          {children}                
        </ul>
      </div>
    </div>
  )
}

FlyoutMenu.Toggle = Toggle
FlyoutMenu.List = List

export default FlyoutMenu