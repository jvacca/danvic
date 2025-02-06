import React, { useState } from "react";
import styles from './ToolTip.module.scss';

type ToolTipProps = {
  show: boolean
  children: React.ReactNode
}

export default function ToolTip({show, children}: ToolTipProps): React.ReactNode {
  
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