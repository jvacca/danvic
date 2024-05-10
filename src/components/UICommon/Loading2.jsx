import styles from './Loading2.module.scss';

export default function Loading2({isShowing}) {
  if (isShowing) {
    return (
      <div className={styles.loader} id='icon-loading'>
        <svg id="logo" xmlns="http://www.w3.org/2000/svg" width="21.241" height="20.145" viewBox="0 0 21.241 20.145">
          <path id="Path_75924" data-name="Path 75924" d="M-56.317,0l-2.5,7.674h-8.134l6.589,4.77-2.5,7.679,6.529-4.75,6.567,4.772-2.509-7.713,6.56-4.757h-8.108Z" transform="translate(66.949)" fill="#e11a2b"/>
        </svg>        
        <svg className={styles.star2} id="logo" xmlns="http://www.w3.org/2000/svg" width="21.241" height="20.145" viewBox="0 0 21.241 20.145">
          <path id="Path_75924" data-name="Path 75924" d="M-56.317,0l-2.5,7.674h-8.134l6.589,4.77-2.5,7.679,6.529-4.75,6.567,4.772-2.509-7.713,6.56-4.757h-8.108Z" transform="translate(66.949)" fill="#e11a2b"/>
        </svg>
        <svg className={styles.star3} id="logo" xmlns="http://www.w3.org/2000/svg" width="21.241" height="20.145" viewBox="0 0 21.241 20.145">
          <path id="Path_75924" data-name="Path 75924" d="M-56.317,0l-2.5,7.674h-8.134l6.589,4.77-2.5,7.679,6.529-4.75,6.567,4.772-2.509-7.713,6.56-4.757h-8.108Z" transform="translate(66.949)" fill="#e11a2b"/>
        </svg>
      </div>
    )
  } else {
    return null;
  }
}