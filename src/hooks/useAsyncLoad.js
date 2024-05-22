//import React from "react";

/*
    custom hook for all API calls that also need validation and error handling
    TODO: expose error and loading states as well
*/

export default function useAsyncLoad(service_id, params) {

  function validateData(data) {
    let isValid = false;
    if (typeof data === 'object' && data.length && data.length > 0) {
        isValid = true;
    }
    else if (typeof data === 'object' && data.length && data.length === 0) {
        console.log("useAsyncLoad: ERROR 0 products found in response ", data);
    }
    else if (typeof data === 'string' && data.includes('<html>')) {
        console.log("useAsyncLoad: ERROR response contains an error message: ", data);
    }
    else {
        console.log("useAsyncLoad: ERROR: ", data);
    }
    return isValid;
  }

  const getUserData = async (service_id, params) => {
    var url = '/api/';
   
    try {
    console.log("useAsyncLoad: ", url, "Fetching from service ", service_id, "with params ", params)

    const response = await fetch(url + service_id, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        //body: JSON.stringify(params), // body data type must match "Content-Type" header
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
            console.log("useAsyncLoad: WARNING: No data in the response ", response);
        }
        }   
    }
    catch (error) {
        if (error.message) {
            console.log('useAsyncLoad: ERROR: error in fetching data: ', error.message, error);
        }
        else {
            console.log('useAsyncLoad: ERROR: error in fetching data: ', error);
        }
    }
   
  }
  return getUserData;
}
