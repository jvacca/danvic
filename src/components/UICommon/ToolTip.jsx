import React, { useState } from "react";
import parse from 'html-react-parser';
import styles from './ToolTip.module.scss';

export default function ToolTip({show, copy}) {
  
  return (
    <>
    {(show) &&
      <div className={styles.tooltip}>
        <div className={styles.container}>
          <p>{parse(copy)}</p>
        </div>
        <div className={styles.triangle}></div>
      </div> 
    }
    </>
  )
}