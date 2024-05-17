import React, { useState } from "react";
import styles from './ToolTip.module.scss';

export default function ToolTip({show, children}) {
  
  return (
    <>
    {(show) &&
      <div className={styles.tooltip}>
        <div className={styles.container}>
          {children}
        </div>
        <div className={styles.triangle}></div>
      </div> 
    }
    </>
  )
}