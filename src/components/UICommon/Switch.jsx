import React, { useEffect, useState } from "react";
import Button from '../UICommon/Button'
import IConSwitchOn from '../../assets/icon-switch-on.svg';
import IConSwitchOff from '../../assets/icon-switch-off.svg';
import styles from './Switch.module.scss';

export default function Switch({id, isActive, toggleSwitchHandler, disable}) {

  useEffect(() => {
  }, [isActive]);

  const onToggleSwitch = (e, id, isActive) => {
    e.stopPropagation();

    if (!disable) toggleSwitchHandler(e, id, !isActive);
  }

  return (
    <div className={styles.switchContainer}>
      <Button onClick={(e) => onToggleSwitch(e, id, isActive)}>
        {(isActive === 'true' || isActive === true)?<IConSwitchOn /> : <IConSwitchOff />}
      </Button>
    </div>
  )
}