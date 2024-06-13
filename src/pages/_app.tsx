import React, { useState, createContext } from 'react'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import {store} from '../store'
import {Provider} from 'react-redux'

import '@/styles/globals.css'

export const WalletProvidersContext = createContext<{ providers: { id: string; }[]; addProvider: (newProvider: { id: string; }) => void; }>({
  providers: [],
  addProvider: function (newProvider: { id: string }): void {
    throw new Error('Function not implemented.')
  }
});



export default function App({ Component, pageProps }: AppProps): React.ReactNode {
  // this needs to be re-written properly
  const [providers, setProviders] = useState<{ id: string }[]>([]) // Explicitly define the type of providers as an array of objects with an id property
  const addProvider = (newProvider: {id: string}) => {
    
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
