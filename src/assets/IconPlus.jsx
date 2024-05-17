import React, { useEffect } from "react";
import styles from "./IconsPlusMinus.module.scss";

export default function IconPlus({
  height,
  width,
  color,
}) {
  useEffect(() => {}, []);

  return (
    <div className={styles.iconNFTDetailsPlus}>
      <div className={styles.iconNFTDetailsMinus}></div>
      <div className={styles.iconNFTDetailsMinus}></div>
    </div>
  );
}
