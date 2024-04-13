import React, { useState, createContext } from 'react'
import Layout from '../components/Layout'
import {store} from '../store'
import {Provider} from 'react-redux'

import '@/styles/globals.css'

export const WalletProvidersContext = createContext();

export default function App({ Component, pageProps }) {
  const [providers, setProviders] = useState([])

  const addProvider = (newProvider) => {
    
    const exists = providers.find((provider) => {
      return provider.id === newProvider?.id
    })

    if (!exists && newProvider) {
      console.log("App: Adding a provider ", newProvider)
      setProviders([
        ...providers,
        newProvider
      ])
    }
  }

  return (
    <Provider store={store}>
      <WalletProvidersContext.Provider value={{providers, addProvider}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </WalletProvidersContext.Provider>
    </Provider>
  )
}
