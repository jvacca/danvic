import React, { useEffect, useState } from "react";
import TextBox from "./TextBox";
import DropDown from './DropDown';
import Button from '@/components/UICommon/Button'
import styles from './RegistrationForm.module.scss';
import Exclamation from '../../assets/icon-warning.svg';
import useAddressValidation from "../../hooks/useAddressValidation";

export default function RegistrationForm({profileInfo, usingAddressValidation, submitData}) {
  const {validate} = useAddressValidation();
  const [formError, setFormError] = useState('');
  const [error, setError] = useState(null);

  const [currentFormData, setCurrentFormData] = useState({
    firstname: (profileInfo)? profileInfo.firstname : '',
    lastname: (profileInfo)? profileInfo.lastname : '',
    address1: (profileInfo)? profileInfo.address1 : '',
    address2: (profileInfo)? profileInfo.address2 : '',
    zip: (profileInfo)? profileInfo.zip : '',
    state: (profileInfo)? profileInfo.state : '',
    city: (profileInfo)? profileInfo.city : '',
    email: (profileInfo)? profileInfo.email : '',
    password: (profileInfo)? profileInfo.password : '',
    confirm_password: (profileInfo)? profileInfo.confirm_password : '',
    phone: (profileInfo)? profileInfo.phone : '',
  })

  const [errorMessages, setErrorMessages] = useState({
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    zip: '',
    state: '',
    city: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  });

  const lookup = {
    subpremise: 'residence number',
    street_number: 'street number',
    route: 'street',
    sublocality_level_1: 'borough or district',
    administrative_area_level_1: 'state',
    postal_code: 'zip',
    locality: 'city',
    postal_code_suffix: 'zip suffix'
  }

  const handleNameValidation = (e) => {
    console.log("RegistrationForm: validating names ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a name'}));
    } else if (/[^A-Za-z\-._ ]/g.test(value)) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please no special characters'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));

    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleAddressValidation = (e) => {
    console.log("RegistrationForm: validating addresses ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter an address'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleAddress2Validation = (e) => {
    console.log("RegistrationForm: validating addresses ", e.target.name, e.target.value);

    const {name, value} = e.target;

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleZipValidation = (e) => {
    console.log("RegistrationForm: validating zip code ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a zip'}));
    } else if (/[^0-9\-]/g.test(value)) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter numeric values'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleStateValidation = (e) => {
    console.log("RegistrationForm: validating state ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please select a state'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleCityValidation = (e) => {
    console.log("RegistrationForm: validating city ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a city'}));
    } else if (/[^A-Za-z\-\\_ ]/g.test(value)) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please no special characters'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handlePasswordValidationOnChange = (e) => {
    console.log("RegistrationForm: validating password on change", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a password'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handlePasswordValidation = (e) => {
    console.log("RegistrationForm: validating password ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a password'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleConfirmPasswordValidation = (e) => {
    console.log("RegistrationForm: validating confirming password ", e.target.name, e.target.value, currentFormData.email);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please re-enter your password'}));
    } else if (value !== currentFormData.password) {
      setErrorMessages((prev) => ({...prev, [name]: 'password must match'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleEmailValidationOnChange = (e) => {
    console.log("RegistrationForm: validating email onChange ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter an email address'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleEmailValidation = (e) => {
    console.log("RegistrationForm: validating email ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter an email address'}));
    } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(value))) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a valid email address'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handlePhoneValidation = (e) => {
    console.log("RegistrationForm: validating phone ", e.target.name, e.target.value);

    const {name, value} = e.target;

    if (!value.trim()) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter a phone number'}));
    } else if (/[^0-9\-\(\) ]/g.test(value)) {
      setErrorMessages((prev) => ({...prev, [name]: 'Please enter numeric values dashes and parenthesis'}));
    } else {
      setErrorMessages((prev) => ({...prev, [name]: ''}));
    }

    setCurrentFormData((prev) => ({...prev, [name]: value}));
  }

  const handleSubmit = () => {
    // gather data and call submitData
    console.log("RegistrationForm: checking the data completion ");

    let invalidFields = [];
    let complete = true;
    for (let field in currentFormData) {
      if ((currentFormData[field] === '' && field !== 'address2') || errorMessages[field] !== '') {
        complete = false;
        invalidFields.push(field);
      }
    };

    if (complete === true) {
      console.log("Form is validated, verifying... ", currentFormData);

      if (usingAddressValidation) {
        validate(currentFormData).then((res) => {
          console.log('address validation response: ~~~~~~~~~~~~~~~~~~~~~~~~~~> ', res);
          
          if (res && res.result && res.result.verdict) {
            const verdict =res.result.verdict;
            if (!verdict.hasUnconfirmedComponents && !verdict.hasReplacedComponents) {
              submitData(currentFormData)
            } else {
              console.log('Address is not a valid U.S. postal address');

              let message = 'Address is not a valid U.S. postal address: ';
              let issues = res.result.address.unconfirmedComponentTypes
              if (issues && issues.length > 0) {
                issues.map(component => {
                  message += 'unconfirmed ' + lookup[component] + ', '
                })

              } else if (!res.result.verdict.addressComplete) {
                message = 'incomplete address'
              }
              setFormError(message);

              /*if (res.result.address.formattedAddress) {
                setDidyouMean(res.result.address.postalAddress)
              }*/
            }
          }
        })
      } else {
        console.log("Form has been validated: ", currentFormData);
        submitData(currentFormData)
      }
    } else {
      console.log("Form is not validated yet: ", invalidFields, currentFormData);

      if (invalidFields.length > 0) {
        invalidFields.map(field => {
          //setErrorMessages((prev) => ({...prev, [field]: `Please fill out or select the ${field} field`}));
          let e = {}
          e.target = {}
          e.target.name = field
          e.target.value = currentFormData[field]

          switch(field) {
            case 'firstname':
              handleNameValidation(e);
              break;
            case 'lastname':
              handleNameValidation(e);
              break;
            case 'address1':
              handleAddressValidation(e);
              break;
            case 'zip':
              handleZipValidation(e);
              break;
            case 'state':
              handleStateValidation(e);
              break;
            case 'city':
              handleCityValidation(e);
              break;
            case 'email':
              handleEmailValidation(e);
              break;
            case 'password':
              handlePasswordValidation(e);
              break;
            case 'confirm_password':
              handleConfirmPasswordValidation(e);
              break;
            case 'phone':
              handlePhoneValidation(e);
              break;
            default:
                console.log('bad field ', field);
          }
        });
        setFormError('There are still missing or invalid information')
      }
    }
  }

  useEffect(()=>{
    if (profileInfo) {
      setCurrentFormData(profileInfo)
    }
  },[profileInfo])

  return (
        <div className={styles.registerFormContainer}>
          <div className={styles.inner}>
            <h2>Create New User</h2>
            
            <p className={styles.formInstructions}>
              Enter your info in the required fields (*) below.
            </p>
            <hr/>
            <div className={styles.formSection}>
              <div className={styles.row}>
                <TextBox 
                  id="firstname" 
                  label="Real Name"
                  maxLength="20"
                  isRequired={false} 
                  validator={handleNameValidation}
                  validator2={handleNameValidation}
                  errorMsg={errorMessages.firstname}
                  value={(currentFormData)? currentFormData.firstname : ''}
                  inputMode={''}
                />
                <TextBox 
                  id="lastname" 
                  label="Profile Name"
                  maxLength="20"
                  placeholderCopy="" 
                  isRequired={true} 
                  validator={handleNameValidation}
                  validator2={handleNameValidation}
                  errorMsg={errorMessages.lastname}
                  value={(currentFormData)? currentFormData.lastname : ''}
                  inputMode={''}
                />
              </div>
            {usingAddressValidation &&
            <>
              <div className={styles.row}>
                <TextBox 
                  id="address1" 
                  label="Address Line 1"
                  maxLength="255"
                  placeholderCopy="" 
                  isRequired={true} 
                  validator={handleAddressValidation}
                  validator2={handleAddressValidation}
                  errorMsg={errorMessages.address1}
                  value={(currentFormData)? currentFormData.address1 : ''}
                  inputMode={''}
                />
              </div>

              <div className={styles.row}>
                <TextBox 
                  id="address2" 
                  label="Address Line 2 (optional)"
                  maxLength="255"
                  placeholderCopy="" 
                  isRequired={false} 
                  validator={handleAddress2Validation}
                  validator2={handleAddress2Validation}
                  errorMsg={errorMessages.address2}
                  value={(currentFormData)? currentFormData.address2 : ''}
                  inputMode={''}
                />
              </div>

              <div className={styles.row}>
                <TextBox 
                  id="zip" 
                  label="Zip Code"
                  maxLength="10"
                  isRequired={true} 
                  validator={handleZipValidation}
                  validator2={handleZipValidation}
                  errorMsg={errorMessages.zip}
                  value={(currentFormData)? currentFormData.zip : ''}
                  inputMode={''}
                />
                <DropDown 
                  id="state" 
                  label="State"
                  placeholderCopy="Please select"
                  validator={handleStateValidation}
                  validator2={handleStateValidation}
                  isRequired={true} 
                  errorMsg={errorMessages.state}
                  value={(currentFormData)? currentFormData.state : ''}
                />
              </div>

              <div className={styles.row}>
                <TextBox 
                  id="city" 
                  label="City"
                  maxLength="40"
                  isRequired={true} 
                  validator={handleCityValidation}
                  validator2={handleCityValidation}
                  errorMsg={errorMessages.city}
                  value={(currentFormData)? currentFormData.city : ''}
                  inputMode={''}
                />
              </div>
            </>}

              <div className={styles.row}>
                <TextBox 
                  id="email" 
                  label="Email"
                  maxLength="50" 
                  isRequired={true} 
                  validator={handleEmailValidationOnChange}
                  validator2={handleEmailValidation}
                  errorMsg={errorMessages.email}
                  value={(currentFormData)? currentFormData.email : ''}
                  inputMode={''}
                />
              </div>

              <div className={styles.row}>
                <TextBox 
                  id="password" 
                  label="Password"
                  maxLength="50"
                  isRequired={true}
                  validator={handlePasswordValidationOnChange}
                  validator2={handlePasswordValidation}
                  errorMsg={errorMessages.confirm_email}
                  value={(currentFormData)? currentFormData.password : ''}
                  inputMode={''}
                />
              </div>

              <div className={styles.row}>
                <TextBox 
                  id="confirm_password" 
                  label="Re-enter Your Password"
                  maxLength="50"
                  isRequired={true}
                  validator={handlePasswordValidationOnChange}
                  validator2={handleConfirmPasswordValidation}
                  errorMsg={errorMessages.confirm_email}
                  value={(currentFormData)? currentFormData.confirm_password : ''}
                  inputMode={''}
                />
              </div>

              <div className={styles.row}>
                <TextBox 
                  id="phone" 
                  label="Phone Number"
                  maxLength="14"
                  isRequired={true}
                  validator={handlePhoneValidation}
                  validator2={handlePhoneValidation}
                  isPhone={"phone"}
                  errorMsg={errorMessages.phone}
                  value={(currentFormData)? currentFormData.phone : ''}
                  inputMode={'tel'}
                />
              </div>
            </div>
            {usingAddressValidation && <div className={styles.noteContainer}>
              <p className={styles.note}>Please note: Item can be shipped to U.S. postal addresses only, while supplies last.</p>
            </div>}
            <hr/>
            {error ? <Button>{error}</Button>: <Button classname={styles.register} onclickHandler={handleSubmit}>Register</Button>}
            <p className={styles.errorMsg}>{formError}</p>
          </div>
        </div>
  )
}