import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react'
import Image from 'next/image';
import Link from "next/link";
import styles from './DropDown.module.scss'

// eslint-disable-next-line react/display-name
const DropDown = forwardRef(({data, triggerIcon}, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.addEventListener('click', () => {
      setIsOpen(false)
    })

    return () => {
      document.removeEventListener('click', () => {})
    }
  }, [])

  useImperativeHandle(ref, () => {
    return {
      openModal() {
        setIsOpen(true)
      },

      closeModal() {
        setIsOpen(false)
      }
    }
  })

  const onClose = (e) => {
    e.stopPropagation();
    setIsOpen(false)
  }

  const toggleShow = (e) => {
    e.stopPropagation();
    
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  return (
    data && <>
      <a onClick={(e) => toggleShow(e)}>
        <Image src={triggerIcon} alt="trigger icon" />
      </a>
      {isOpen && <div className={styles.wrapper}>
        <ul className={styles.inner}>
          {data?.map((option) => (
            <li key={option.id}>
              {option.icon? option.icon : null}
              {(option.type === 'link')? <Link href={option.route} onClick={onClose}>{option.label}</Link> : null}
              {(option.type === 'linkout')? <a href={option.url} onClick={onClose} target='_blank'>{option.label}</a> : null}
              {(option.type === 'button')? <a onClick={option.onclick} target='_blank'>{option.label}</a> : null}
            </li>
          ))}
        </ul>
      </div>}
    </>
  )
})

export default DropDown