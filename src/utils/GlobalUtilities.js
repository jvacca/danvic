import config from '../config'

const textEllipsisMid = (text) => {
  if (text) {
      const beginning = text.slice(0, 6);
      const ending = text.slice(-4);
      return `${beginning}...${ending}`;
  }
}

const copyToClipBoard = async (text) => {
  await navigator.clipboard.writeText(text);
  console.log("Copied to clipboard ", text)
}

const imageLoader = ({ src, width, quality }) => {
  console.log("setting path to: ", `${config.CAMPAIGNROOT}${src}`)
  return `${config.CAMPAIGNROOT}${src}`
}

const setCookie = (name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const eraseCookie = (name) => {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
const getMultiCookies = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)','g'));
    if (match) return match;
}
const getParameterByName = (name, url) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


const getApiUrl = ()=>{
    let url = 'https://web3servicesmcom.herokuapp.com';
    if (window.location.host.indexOf('localhost') > -1) {
        url = 'http://localhost:3005';
    }
    if (window.location.host.indexOf('fds')> -1) {
        url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
    }
    console.log('getApiUrl', url)

    return url;
}

const routing = () => {

}

export {textEllipsisMid, imageLoader, setCookie, eraseCookie, getCookie, copyToClipBoard, getMultiCookies, getParameterByName, getApiUrl, routing}