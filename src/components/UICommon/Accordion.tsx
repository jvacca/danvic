import React, { useState, useEffect } from "react"
import IConExpand from '@/assets/icon-faqs-expand.svg'
import IConCollapse from '@/assets/icon-faqs-collapse.svg'
import styles from './Accordion.module.scss'

type AccordionProps = {
  children: React.ReactNode
  classname?: string
  initItemOpen?: string
}


export default function Accordion({children, classname, initItemOpen}: AccordionProps): React.ReactNode {
  const [itemExpanded, setItemExpanded] = useState<string>(null)
  
  useEffect(() => {
    //console.log('checking: ', itemExpanded)
    if (initItemOpen) {
      setItemExpanded(initItemOpen)
    }
  }, [initItemOpen])

  return (
    <div className={`${styles["Accordion"]} ${classname}`}>
      {React.Children.map(children, (child: React.ReactElement) => (
        React.cloneElement(child, {itemExpanded, setItemExpanded})
      ))}
    </div>
  )
}

type HeadProps = {
  children: React.ReactNode
  open: boolean
  toggle: (newStatus: boolean) => void
  classname?: string
  iconExpand?: React.ReactNode
  iconCollapse?: React.ReactNode
}

function Head({children, open, toggle, classname, iconExpand, iconCollapse}: HeadProps): React.ReactNode {
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

type BodyProps = {
  children: React.ReactNode
  open: boolean
  classname?: string
}

function Body({children, open, classname}: BodyProps): React.ReactNode {
  return (
    open &&
      <div className={`${styles["body"]} ${classname}`}>
        {children}
      </div>
  )
}

type ItemProps = {
  children: React.ReactNode
  id: string
  itemExpanded: string
  setItemExpanded: (id: string) => void
  classname?: string
}

function Item({children, id, itemExpanded, setItemExpanded, classname}: ItemProps): React.ReactNode {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    //console.log('item checking: ', itemExpanded)
    if (open === true && id !== itemExpanded) setOpen(false)

    if (id === itemExpanded) setOpen(true)
  }, [id, open, itemExpanded])
  

  const toggle = (newStatus: boolean) => {
    setOpen(newStatus)
    if (newStatus === true) setItemExpanded(id)
  }
  return (
    <div id={id} className={`${styles["item"]} ${classname}`}>
      {React.Children.map(children, (child: React.ReactElement) => (
        React.cloneElement(child, {open, toggle})
      ))}
    </div>
  )
}

Accordion.Head = Head
Accordion.Body = Body
Accordion.Item = Item