import React, { useEffect, useState } from "react";
import styles from './Faq.module.scss'
import parse from 'html-react-parser';

export default function FAQList(Accordion: any, faqsData: any) {
  function NewFAQList(): React.ReactNode {
    const [changeOpened, setChangedOpen] = useState<string>(null)
    
    function forceOpen(id: string) {
      //console.log("Dude, WTF? ", id)
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
        {faqsData.questions.map((faq: any) => (
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
      </>
    )
  }

  return NewFAQList
}