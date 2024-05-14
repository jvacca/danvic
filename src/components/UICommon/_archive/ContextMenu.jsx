import React, { useState } from "react";
import IConHeart from '@/assets/icon-heart.svg';
import IConTrash from '@/assets/icon-trash.svg';
import IConLinkout from '@/assets/icon-linkout.svg';
import IConManage from '@/assets/icon-manage.svg';
import styles from './ContextMenu.module.scss';

export default function ContextMenu({walletAddress, onRemoveWallet, onSetDefaultWallet, onHideContextMenu, onAlternate}) {
  const onLinkout = (e) => {
    onHideContextMenu(walletAddress, e)
  }
  return(
    walletAddress?
    <div className={styles.contextMenu}>
        <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
          {(onAlternate)? <ul className={styles.cmList}>
            <li><IConHeart /><a onClick={() => onSetDefaultWallet(walletAddress)}>Set default wallet</a></li>
            <li><IConLinkout /><a href={`https://etherscan.io/address/${walletAddress}`} target="_blank" onClick={(e) => onLinkout()}>View on explorer</a></li>
            <li>
              <IConManage /><a href="https://wallet.magic.link/" target="_blank" onClick={(e) => onLinkout()}>Manage digital address</a>
              <p className={styles.note}>This mstylelab digital address is linked to your account and cannot be disconnected or removed.</p>
            </li>
          </ul>
          :
          <ul className={styles.cmList}>
            <li><IConHeart /><a onClick={() => onSetDefaultWallet(walletAddress)}>Set default wallet</a></li>
            <li><IConLinkout /><a href={`https://etherscan.io/address/${walletAddress}`} target="_blank" onClick={(e) => onLinkout()}>View on explorer</a></li>
            <li><IConTrash /><a onClick={() => onRemoveWallet(walletAddress)}>Remove from list</a></li>
          </ul>}
        </div>
    </div>
    :
    null
    )
}