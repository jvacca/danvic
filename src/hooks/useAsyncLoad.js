//import React from "react";

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
    // var url = 'https://web3.macysmedianetwork.com';
      // fields=email,username
    var url = 'https://web3servicesmcom.herokuapp.com';
    if (window.location.host.indexOf('localhost') > -1) {
      var url = 'http://localhost:3005';
    }
      if (window.location.host.indexOf('fds')> -1) {
          url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
      }

      try {
      console.log("useAsyncLoad: ", url, "Fetching from service ", service_id, "with params ", params)

      const response = await fetch(url + service_id, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
              "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
          body: JSON.stringify(params), // body data type must match "Content-Type" header
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
