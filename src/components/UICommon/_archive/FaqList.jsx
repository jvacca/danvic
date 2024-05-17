import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNavItemActive } from "../../reducers/ApplicationSlice";
import {useRouter} from "next/navigation";
import parse from 'html-react-parser';
import styles from './FaqList.module.scss';
import IconCollapse from '@/assets/icon-faqs-collapse.svg';
import IconExpand from '@/assets/icon-faqs-expand.svg';

//import { openVideoModal } from "@/reducers/modalSlice";
// import QuestionMarks from '../assets/svg/icon-question-marks.svg';

function FaqList({sectionOrigin, questions}) {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState(null);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.application.isLoggedIn);

    useEffect(() => {
        //dispatch(setNavItemActive('faq'));
        console.log('current open index is', openIndex);
        let params = new URLSearchParams(window.location.search);

        //open link to amex question
        if (params.get('amexQuestion')) {
            if(params.get('amexQuestion') === 'true') {
                // openFaq(20, 'amexQuestion')
                setOpenIndex(20);
                if (document.getElementById('amexQuestion')) {
                    document.getElementById('amexQuestion').scrollIntoView({
                        behavior: 'smooth',
                    });
                }
                setTimeout(function(){
                    window.history.replaceState('#', {}, "?openedamexQuestion");
                },2000)
            }
        }
        console.log('isLoggedIn? ', isLoggedIn);

        
    }, []);


    // Function to open a specific FAQ based on its index
    const openFaq = (index, target) => {
        console.log(target.id);
        if (target && target.id && target.id === "trophyQuestion") {
            index = sectionOrigin === 'parade' ? 1 : 17;
            setTimeout(() => {
                document.getElementById(target.id).scrollIntoView({
                    behavior: 'smooth',
                });
            }, 100); // Set timeout for 250ms
        } else if (target && target.id && target.id === "figurineQuestion") {
            index = sectionOrigin === 'parade' ? 2 : 18;
            setTimeout(() => {
                document.getElementById(target.id).scrollIntoView({
                    behavior: 'smooth',
                });
            }, 100); //
        } else if (target && target.id && target.id === "recapVideoModal") {
            dispatch(openVideoModal({
                videoUrl: 'https://storage.googleapis.com/imp-projects-c/nft/assets2/videos/recap.mp4',
                backdropStyle: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
            }));
        } else if (target && target.id && target.id === "emailNotifications") {
            console.log('email notifications')
            if (isLoggedIn) {
                console.log('logged in click')
                router.push('/profile/notifications/');
            } else {
                document.getElementById('header').scrollIntoView({behavior: 'smooth'})
            }
        }
        setOpenIndex(prevIndex => prevIndex !== index ? index : null);
    };

    return (
        <>
            <div className={styles.faqFrame}>
                <div className={styles.inner}>
                    <ul className={styles.faqList}>
                        {questions.map((faq, index) => (
                            <li key={faq.id} id={faq.id ? faq.id : null}>
                                <div className={styles.faqElement}>
                                    <div className={styles.faqContent} onClick={(e) => openFaq(index, e.target)}>
                                        <div className={styles.btnExpandCollapse}>
                                            {openIndex === index ? <IconCollapse /> : <IconExpand />}
                                        </div>
                                        <h3>{parse(faq.q)}</h3>
                                        {openIndex === index && <p>{parse(faq.a)}</p>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default FaqList;
