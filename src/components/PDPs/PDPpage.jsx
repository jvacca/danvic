import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Accordion from '@/components/UICommon/Accordion'

import { textEllipsisMid } from '@/services/GlobalUtilities';
import IconPlus from '@/assets/IconPlus';
import IconMinus from "@/assets/IconMinus";
import {Network} from "alchemy-sdk";
import styles from './nftDetail.module.scss';

export default function PDPpage({NFTData, network}) {

  const getMedia = () => {
    console.log("NFTListAlchemy: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> check media ")

    return <img src={NFTData?.raw?.metadata?.image} alt={"NFT media"} />
  }

  return (
    <div className={styles.detailsFrame}>
        {NFTData &&
            <div className={styles.detailsWrap}>
                <Link href="/profile/dashboard">Back to dashboard</Link>

                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        {getMedia()}
                    </div>
                    <div className={styles.copyContainer}>
                        <h2 data-alt={NFTData.name}>
                            {NFTData.name}
                        </h2>
                        <p>{NFTData.description}</p>

                        <Accordion>
                            <Accordion.Item id={'details'}>
                                <Accordion.Head classname={styles.head} iconExpand={<IconPlus />} iconCollapse={<IconMinus />}>
                                    <h3>NFT Details</h3>
                                </Accordion.Head>
                                <Accordion.Body>
                                    <div className={styles.detailsContent}>
                                        <div className={styles.specs}>
                                            <ul>
                                                <li className={styles.gradientBackground}>
                                                    <span>Contact Address</span>{" "}
                                                    {textEllipsisMid(NFTData.contract?.address)}
                                                </li>
                                                <li className={styles.gradientBackground}>
                                                    <span>Token ID</span> {NFTData.tokenId}
                                                </li>
                                                <li className={styles.gradientBackground}>
                                                    <span>Token Type</span> {NFTData.tokenType}
                                                </li>
                                                <li className={styles.gradientBackground}>
                                                    <span>Network</span>
                                                    {network}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item id={'history'}>
                                <Accordion.Head classname={styles.head} iconExpand={<IconPlus />} iconCollapse={<IconMinus />}>
                                    <h3>NFT History</h3>
                                </Accordion.Head>
                                <Accordion.Body>
                                    <p>[History here]</p>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </div>}
    </div>
  )
}
