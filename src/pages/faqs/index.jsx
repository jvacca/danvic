import React, { useEffect, useState } from "react";
import Head from '@/components/Head'
import Accordion from '@/components/UICommon/Accordion'
import faqsData from '../../../data/FAQ.json'
import FAQList from './FAQList'
import styles from './Faq.module.scss'

export default function Faqs() {
  // example of HOC
  const FaqList = FAQList(Accordion, faqsData)
  
  return (
    <>
      <Head title="Offboarding Sweet.io" />
      <div className={styles.faqFrame}>
        <div className={styles.inner}>
          <h2>Frequently<br />Asked Questions</h2>
          
          <FaqList />
        </div>
      </div>
    </>
  )
}
