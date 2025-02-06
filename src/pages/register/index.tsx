import React, {useState} from 'react'

import RegistrationForm from '@/components/Registration/RegistrationForm'
import styles from '@/components/Registration/RegistrationForm.module.scss';

export default function Register(): React.ReactNode {
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const submitData = () => {
    setIsRegistered(true)
  }

  return (
    <div className={styles.registerPageFrame}>
      <div className={styles.registerPageInner}>
        {isRegistered?
          <div className="registered">
            <h1>User Registration Successful!</h1>
            <p>Please sign in now</p>
          </div>
          :
          <RegistrationForm useAddressValidation={false} submitData={submitData} />
        }
      </div>
    </div>
  )
}