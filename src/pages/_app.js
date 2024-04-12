import React from 'react'
import Layout from '../components/Layout'
import {store} from '../store'
import {Provider} from 'react-redux'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
