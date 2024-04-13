import React, {useState, forwardRef, useImperativeHandle} from 'react'
import Button from '../UICommon/Button'
import IconClose from '@/assets/icon-close-black.svg'
import styles from './Modal.module.scss'

// eslint-disable-next-line react/display-name
const Modal = forwardRef(({children}, ref) => {
  const [isOpen, setIsOpen] = useState(false)

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

  const onCloseModalFromOutside = (e) => {
    if (e.target.className.indexOf("modalMaskOuter") > -1) {
      setIsOpen(false)
    } else {
      console.log("Not the outer shell")
    }
  }

  const onCloseModal = (e) => {
    e.stopPropagation();
    setIsOpen(false)
  }

  return (
    isOpen && <div className={styles.modalMaskOuter} onClick={(e) => onCloseModalFromOutside(e)}>
      <div className={styles.modalMaskInner}>
        {children}
        <Button className={styles.btnClose} onClick={(e) => onCloseModal(e)}>
          <IconClose />
        </Button>
      </div>
      
    </div>
  )
})

export default Modal