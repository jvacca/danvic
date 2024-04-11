import React, { useEffect, useState } from "react";

import styles from './RegistrationForm.module.scss';

export default function TextBox({id, label, maxLength, isRequired, validator, validator2, errorMsg, value, inputMode}) {
  return (
      <div id={styles[id]}>
        <p className={styles.label}>{label}{isRequired? <sup>*</sup> : null} </p>
        <input 
          className={(errorMsg)? styles.error : ''} 
          name={id} 
          value={value}
          type="text" 
          maxLength={(maxLength !== '')? maxLength : ''}
          onChange={validator}
          onBlur={validator2}
          inputMode={(inputMode !== '')? inputMode : 'text'}
        />
        <p className={styles.errorMsg}>{errorMsg}</p>
      </div>
  )
}