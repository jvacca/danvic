import React, { useState, forwardRef, useRef, useImperativeHandle, useContext } from "react";
import styles from './FlyoutMenu.module.scss';
import {FlyoutContext} from '../WalletComponents/WalletManager'

export interface FlyoutMenuHandlers {
  closeMenu: () => void
}

interface FlyoutMenuProps {
  classname: string,
  children: React.ReactNode
}

interface ToggleProps {
  id: string,
  children: React.ReactNode,
  open?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
  classname: string
} 

interface ListProps {
  children: React.ReactNode,
  open?: boolean,
  classname: string
}

type FlyoutMenuComponent = React.ForwardRefExoticComponent<FlyoutMenuProps & React.RefAttributes<FlyoutMenuHandlers>> & {
  Toggle: typeof Toggle;
  List: typeof List;
};

 // eslint-disable-next-line react/display-name
const FlyoutMenu = forwardRef<FlyoutMenuHandlers, FlyoutMenuProps>(({classname, children}, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      closeMenu() {
        setOpen(false)
      }
    }
  })

  return (
      <div className={`${styles["FlyoutMenu"]} ${classname}`}>
        {React.isValidElement(children) && React.Children.map(children, (child: React.ReactElement<any>) => (
          React.cloneElement(child, {open, setOpen})
        ))}
      </div>
    )
}) as FlyoutMenuComponent

function Toggle({id, children, open, setOpen, classname}: ToggleProps) {
  const flyoutListner = useContext(FlyoutContext);

  const toggleMenu = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (setOpen) {
      setOpen(!open)
    }

    if (open === false && flyoutListner) flyoutListner(id)
  }

  return (
    <button className={`${styles["FlyoutMenuToggle"]} ${classname}`} onClick={(e) => toggleMenu(e)}>
      {children as React.ReactElement}
    </button>
  )
}

function List({children, open, classname}: ListProps) {
  return (
    open && 
    <div className={`${styles["FlyoutMenuList"]} ${classname}`}>
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
        {children}                
      </div>
    </div>
  )
}

FlyoutMenu.Toggle = Toggle
FlyoutMenu.List = List

export default FlyoutMenu