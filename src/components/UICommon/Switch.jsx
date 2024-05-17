import React, { useEffect, useState } from "react";
import Button from '../UICommon/Button'

import styles from './Switch.module.scss';

export default function Switch({id, isActive, toggleSwitchHandler, disable, children}) {

  useEffect(() => {
  }, [isActive]);

  const onToggleSwitch = (e, id, isActive) => {
    e.stopPropagation();
    if (!disable) toggleSwitchHandler(e, id, !isActive);
  }

  return (
    <div className={styles.switchContainer}>
      <button onClick={(e) => onToggleSwitch(e, id, isActive)}>
        {(isActive === 'true' || isActive === true)?
          children[0]
          : 
          children[1]
          }
      </button>
    </div>
  )
}