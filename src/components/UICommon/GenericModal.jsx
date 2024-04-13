import React, { useState } from "react";
import Button from '../UICommon/Button'
//just to get around linter errors
import parse from 'html-react-parser';
import IconClose from '@/assets/icon-close-black.svg';
import styles from './GenericModal.module.scss';

export default function MacysWalletModal({showModal, copy, onCloseModal, buttonAction, buttonCopy}) {

  const handleClickOutside = (e) => {
    //console.log("resetting display of modal");
    onCloseModal()
  }

  return (
    <>
    {(showModal) &&
    <div className={styles.modalmask} onClick={handleClickOutside}>
      <div className={styles.modalmaskOuter}>
        <div className={styles.modalmaskInner}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.content}>
              {copy && copy.title && (<h2>{parse(copy.title)}</h2>)}
              {copy && copy.body && (<p>{parse(copy.body)}</p>)}
              {buttonAction && (<Button className={buttonStyles["button-green"]} onClick={buttonAction}>{buttonCopy}</Button>)}
            </div>
            <Button className={styles.btnClose} onClick={onCloseModal}>
              <IconClose />
            </Button>
          </div>
        </div>
      </div>
    </div>
    }
    </>
  )
}