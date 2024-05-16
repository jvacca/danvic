import React, { useState, useEffect } from "react"
import IConExpand from '@/assets/icon-faqs-expand.svg'
import IConCollapse from '@/assets/icon-faqs-collapse.svg'
import styles from './Accordion.module.scss'

export default function Accordion({children, classname}) {
  const [itemExpanded, setItemExpanded] = useState(null)
  
  useEffect(() => {
    console.log('checking: ', itemExpanded)
  }, [itemExpanded])
  return (
    <div className={`${styles["Accordion"]} ${classname}`}>
      {React.Children.map(children, (child) => (
        React.cloneElement(child, {itemExpanded, setItemExpanded})
      ))}
    </div>
  )
}

function Head({children, open, toggle, classname}) {
  const onToggle = () => {
    toggle(!open)
  }
  return(
    <div className={`${styles["head"]} ${classname}`}>
      <a href onClick={onToggle}>
        { !open && <IConExpand />}
        { open && <IConCollapse />}
      </a>
      {children}
    </div>
  )
}

function Body({children, open, classname}) {
  return (
    open &&
      <div className={`${styles["body"]} ${classname}`}>
        {children}
      </div>
  )
}

function Item({children, id, itemExpanded, setItemExpanded, classname}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    console.log('checking: ', itemExpanded)
    if (open === true && id !== itemExpanded) setOpen(false)
  }, [itemExpanded])
  

  const toggle = (newStatus) => {
    setOpen(newStatus)
    if (newStatus === true) setItemExpanded(id)
  }
  return (
    <div className={`${styles["item"]} ${classname}`}>
      {React.Children.map(children, (child) => (
        React.cloneElement(child, {open, toggle})
      ))}
    </div>
  )
}

Accordion.Head = Head
Accordion.Body = Body
Accordion.Item = Item