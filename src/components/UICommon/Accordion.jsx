import React, { useState, useEffect } from "react"
import IConExpand from '@/assets/icon-faqs-expand.svg'
import IConCollapse from '@/assets/icon-faqs-collapse.svg'
import styles from './Accordion.module.scss'

export default function Accordion({children, classname, initItemOpen}) {
  const [itemExpanded, setItemExpanded] = useState(null)
  
  useEffect(() => {
    console.log('checking: ', itemExpanded)
    if (initItemOpen) {
      setItemExpanded(initItemOpen)
    }
  }, [initItemOpen])

  return (
    <div className={`${styles["Accordion"]} ${classname}`}>
      {React.Children.map(children, (child) => (
        React.cloneElement(child, {itemExpanded, setItemExpanded})
      ))}
    </div>
  )
}

function Head({children, open, toggle, classname, iconExpand, iconCollapse}) {
  const onToggle = () => {
    toggle(!open)
  }
  return(
    <div className={`${styles["head"]} ${classname}`}>
      <a onClick={onToggle}>
        { !open && (iconExpand? iconExpand : <IConExpand />)}
        { open && (iconCollapse? iconCollapse : <IConCollapse />)}
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
    console.log('item checking: ', itemExpanded)
    if (open === true && id !== itemExpanded) setOpen(false)

    if (id === itemExpanded) setOpen(true)
  }, [itemExpanded])
  

  const toggle = (newStatus) => {
    setOpen(newStatus)
    if (newStatus === true) setItemExpanded(id)
  }
  return (
    <div id={id} className={`${styles["item"]} ${classname}`}>
      {React.Children.map(children, (child) => (
        React.cloneElement(child, {open, toggle})
      ))}
    </div>
  )
}

Accordion.Head = Head
Accordion.Body = Body
Accordion.Item = Item