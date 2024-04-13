//import Config from '../config';
//import axios from 'axios';
export default class DataProvider {
    constructor() {
        console.log("DataProvider initializing ");
       
    }
    getCachedData() {
        return this.cachedData;
    }
    static async getData(url) {
      //let url = Config.DATAPROVIDER_TESTENV + Config.DATAPROVIDER_GETPRODUCT_ENDPOINT + ids;
        if (window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('fds') > -1) {
            console.log("DataProvider: Getting data with ... ", url);
        }
      let response;
      try {
          response = await fetch(url, {
              method: 'GET'
          });
          if (response) {
            let data = await response.json();
            if (data) {
                //if (DataProvider.validateData(data) === true) {
                    this.cachedData = data;
                    return data;
                //}
            }
            else {
                console.log("WARNING: No data in the response ", response);
            }
          }   
      }
      catch (error) {
          if (error.message) {
              console.log('ERROR: error in fetching data: ', error.message, error);
          }
          else {
              console.log('ERROR: error in fetching data: ', error);
          }
      }
        
    }
    static validateData(data) {
        let isValid = false;
        if (typeof data === 'object' && data.length && data.length > 0) {
            isValid = true;
        }
        else if (typeof data === 'object' && data.length && data.length === 0) {
            console.log("ERROR 0 products found in response ", data);
        }
        else if (typeof data === 'string' && data.includes('<html>')) {
            console.log("ERROR response contains an error message: ", data);
        }
        else {
            console.log("ERROR: ", data);
        }
        return isValid;
    }
    static async postData(url, body, credentials) {
        //let url = Config.DATAPROVIDER_TESTENV + Config.DATAPROVIDER_GETPRODUCT_ENDPOINT + ids;
        console.log("DataProvider: Getting data with ... ", url);
        // var urlencoded = new URLSearchParams();
        // urlencoded.append("qweqweqw", "weqweqweqwe");

        let response;
        let obj = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        if (credentials) {
            obj.credentials = 'same-site';
        }
        try {
            response = await fetch(url, obj);
            if (response) {
                let data = await response.json();
                if (data) {
                    //if (DataProvider.validateData(data) === true) {
                    this.cachedData = data;
                    return data;
                    //}
                }
                else {
                    console.log("WARNING: No data in the response ", response);
                    return {};
                }
            } else {
                return {};
            }
        }
        catch (error) {
            if (error.message) {
                console.log('ERROR: error in fetching data: ', error.message, error, url);
                return {};
            }
            else {
                console.log('ERROR: error in fetching data: ', error, url);
                return {};
            }
        }

    }
    static async postDataIYK(url, body, iykcode) {
        //let url = Config.DATAPROVIDER_TESTENV + Config.DATAPROVIDER_GETPRODUCT_ENDPOINT + ids;
        console.log("DataProvider: postDataIYK data with ... ", url, body);
        // var urlencoded = new URLSearchParams();
        // urlencoded.append("qweqweqw", "weqweqweqwe");

        let response;
        let obj = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-iyk-api-key": "b0b20389c1241d3b00e27fce460c05e5be037cd0f28a21f09b062af595dc2334",
                "x-iyk-code" : body.linkedToken.otp
            },
            body: JSON.stringify({
                contractAddress: body.linkedToken.contractAddress,
                chainId: body.linkedToken.chainId,
                tokenId: body.linkedToken.tokenId,
                recipient: body.recipient
            })
        }
        // if (credentials) {
        //     obj.credentials = 'same-site';
        // }
        try {
            response = await fetch(url, obj);
            if (response) {
                let data = await response.json();
                if (data) {
                    this.cachedData = data;
                    return data;
                }
                else {
                    console.log("WARNING: No data in the response ", response);
                }
            }
        }
        catch (error) {
            if (error.message) {
                console.log('ERROR: error in fetching data: ', error.message, error);
            }
            else {
                console.log('ERROR: error in fetching data: ', error);
            }
        }

    }
}
