import React, { useEffect } from "react";
import styles from "./LineDivider.module.scss";

type LineDividerProps = {
  className?: string;
  height: number;
  width: number;
  borderSide: "top" | "bottom" | "left" | "right";
  borderStyle: string;
  borderColor: string;
};

export default function LineDivider({ className, height, width, borderSide, borderStyle, borderColor }) {

  function capitalizeFirstLetter(stringParam: string) {
    return stringParam.charAt(0).toUpperCase() + stringParam.slice(1);
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
