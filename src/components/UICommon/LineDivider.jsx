import React, { useEffect } from "react";
import styles from "./LineDivider.module.scss";

export default function LineDivider({ className, height, width, borderSide, borderStyle, borderColor }) {

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  borderSide = capitalizeFirstLetter(borderSide);
  return (
    <div className={`${styles.lineDivider} ${className}`}
      style={{ 
        height: `${height}px`,
        width: `${width}`,
        [`border${borderSide}`]: `1px ${borderStyle} ${borderColor}`
      }}>
      <span style={{color: `${borderColor}`}}>{height}</span>
    </div>
  );
}
