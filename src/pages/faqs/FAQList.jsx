import React, { useEffect, useState } from "react";
import styles from './Faq.module.scss'
import parse from 'html-react-parser';

export default function FAQList(Accordion, faqsData) {
  function NewFAQList() {
    const [changeOpened, setChangedOpen] = useState(null)
    
    function forceOpen(id) {
      console.log("Dude, WTF? ", id)
      setChangedOpen(id)
      if (document.getElementById(id)) {
        document.getElementById(id).scrollIntoView({
            behavior: 'smooth',
        });
      }
    }

    useEffect(() => {
      const params = new URLSearchParams(window.location.search)

      if (params.get('openQuestion')) {
        let id = params.get('openQuestion')
        forceOpen(id)
    }
    }, [])
    

    return (
      <>
      <Accordion classname={styles.faqList} initItemOpen={changeOpened}>
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

      <button onClick={() => forceOpen('0')}>Open question 1</button>
      </>
    )
  }

  return NewFAQList
}