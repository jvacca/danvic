import React, { useEffect, useState } from "react";
import Button from './Button'

import styles from './Switch.module.scss';

type SwitchProps = {
  id: string,
  isActive: boolean | string,
  toggleSwitchHandler: (e: React.MouseEvent<HTMLButtonElement>, id: string, isActive: boolean | string) => void,
  disable?: boolean,
  children: [React.ReactNode, React.ReactNode]
}

export default function Switch({id, isActive, toggleSwitchHandler, disable, children}: SwitchProps): React.ReactNode {

  useEffect(() => {
  }, [isActive]);

  const onToggleSwitch = (e: React.MouseEvent<HTMLButtonElement>, id: string, isActive: boolean | string) => {
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