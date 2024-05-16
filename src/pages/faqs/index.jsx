import React, { useEffect, useState } from "react";
import Head from '@/components/Head'
import Accordion from '@/components/UICommon/Accordion'
import faqsData from '../../../data/FAQ.json'
import styles from './Faq.module.scss'
import parse from 'html-react-parser';

export default function Faqs() {

  return (
    <>
      <Head title="Offboarding Sweet.io" />
      <div className={styles.faqFrame}>
        <div className={styles.inner}>
          <h2>Frequently<br />Asked Questions</h2>
          
          <Accordion classname={styles.faqList}>
            {faqsData.questions.map((faq, index) => (
              <Accordion.Item key={faq.id} id={faq.id} classname={styles.faqElement}>
                <Accordion.Head classname={styles.faqHead}>
                    <h3>{parse(faq.q)}</h3>
                </Accordion.Head>
                <Accordion.Body classname={styles.faqContent}>
                    <p>{parse(faq.a)}</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
