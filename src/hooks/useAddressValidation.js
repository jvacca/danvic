//import React from "react";
import Config from '../config';
export default function useAddressValidation(service_id, params) {

  /*
  custom hook to validate any forms that needs google's address validation
  */
  
  const validate = async (addressObj) => {
    const url = 'https://addressvalidation.googleapis.com/v1:validateAddress';
    const key = '?key=' + Config.API_KEY;
    const requestBody = {
      "address": {
        "regionCode": "US",
        "addressLines": [
          addressObj.address1
        ],
        "locality": addressObj.city,
        "administrativeArea": addressObj.state,
        "postalCode": addressObj.zip
      },
      "enableUspsCass": true
    }
        
    try {
      console.log("useAddressValidation: ", url, "with address ", addressObj)

      const response = await fetch(url + key, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
      });

      if (response) {
            let data = await response.json();
            if (data) {
                //if (validateData(data) === true) {
                    return data;
                //} else {
                  //console.log("Failed validation");
                //}
            }
            else {
                console.log("useAddressValidation: WARNING: No data in the response ", response);
            }
          }   
      }
      catch (error) {
          if (error.message) {
              console.log('useAddressValidation: ERROR: error in fetching data: ', error.message, error);
          }
          else {
              console.log('useAddressValidation: ERROR: error in fetching data: ', error);
          }
      }
   
  }
  return {validate};
}
