import React, { useState, useEffect } from "react";
import Picture from '../shared/Picture';
import styles from './DigitalItem.module.scss';
import DataProvider from "../../utils/DataProvider";

export default function DigitalItem({id, attributes}) {
  const [state, setState] = useState(false);
  useEffect(() => {
    console.log('color, pattern', attributes)
    if (typeof attributes.palette == 'undefined') {
      let name = sessionStorage.getItem('profileName') || '0';
      let path = window.location.pathname.split('/').filter((o)=>{ return o });
      if (name !== path[path.length-1]) {
        name = path[path.length-1];
      }
      let getAt = (async() => {
        let url = 'https://web3servicesmcom.herokuapp.com';
        if (window.location.host.indexOf('localhost') > -1) {
          url = 'http://localhost:3005';
        }
        if (window.location.host.indexOf('fds')> -1) {
          url = 'https://web3servicesstaging-fe3af8a30134.herokuapp.com';
        }

        let user = sessionStorage.getItem('profileName') ? sessionStorage.getItem('profileName') : name;
        if (user) {
          if (sessionStorage.getItem('profileName') || user) {
            let getAttr = await DataProvider.getData(`${url}/users/usernameattr?username=${sessionStorage.getItem('profileName') ? sessionStorage.getItem('profileName') : user}`);
            console.log(getAttr, 'getAttr');
            attributes = getAttr;
            return getAttr;
          } else {
            attributes = {};
            return {}
          }
        }
      })
    }
  }, []);
  const handler = (e) => {
    //
  }
  let url = ""
  try {
    url = `tshirt/webp/pattern0${attributes.pattern}_color${parseInt(attributes.palette)+1}.webp?1`;
    if (attributes.pattern == 4) {
      let firstletter = new RegExp('[a-zA-Z]', 'g').exec(attributes.name)
      let letter = ""
      if (firstletter) {
        letter = firstletter[0].toUpperCase();
      } else {
        letter = "M";
      }
      url = `tshirt/webp/pattern0${attributes.pattern}_${letter}_color${parseInt(attributes.palette)+1}.webp?1`;
      console.log('firstletter', firstletter);
    }
  } catch(e){}
  return(
    <div className={styles.digitalItemContainer}>
      <Picture
        desktop={url}
        mobile={url}
      ></Picture>
    </div>
  )
}