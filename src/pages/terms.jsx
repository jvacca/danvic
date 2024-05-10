import Link from 'next/link';
import React, {useEffect, useState} from "react";
import Head from '../components/Head';
import styles from './static.module.scss';

export default function Terms() {
    return (
        <>
        <Head title="Terms of Use" />
        <div className={styles.wrapperframe}>
            <div className={styles.wrapperbody}>
                <div className={styles.wrappercontent}>
                  <h1>Terms of Use </h1>

                  <p><b>Effective Date: 8/29/23</b></p>

                  <p>Legal copy here</p> 
                </div>
             </div>
         </div>
         </>)
}