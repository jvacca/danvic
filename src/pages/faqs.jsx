import React, { useEffect, useState } from "react";
import Head from '../components/Head';
import FaqList from '../components/Faq/FaqList'; // Assuming FaqList is in the same directory
import faqsData from '../../data/FAQ.json';
import styles from './faq.module.scss';
import { useDispatch } from "react-redux";
import { setNavItemActive } from "../reducers/ApplicationSlice";

export default function Faqs() {
  const paradeIsLive = true;
  const dispatch = useDispatch();

  const questionsToDisplay = faqsData.questions

  return (
    <>
      <Head title="Offboarding Sweet.io" />
      <div className={styles.faqFrame}>
        <div className={styles.inner}>
          <h2>Frequently<br />Asked Questions</h2>
          <FaqList questions={questionsToDisplay} />
        </div>
      </div>
    </>
  );
}
