import React, {useState} from 'react'

import RegistrationForm from './RegistrationForm'
import styles from './RegistrationForm.module.scss';

export default function Register() {

  const submitData = (e) => {

  }

  return (
    <div className={styles.registerPageFrame}>
      <div className={styles.registerPageInner}>
        <RegistrationForm useAddressValidation={false} submitData={submitData} />
      </div>
    </div>
  )
}