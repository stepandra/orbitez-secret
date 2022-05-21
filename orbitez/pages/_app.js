import '../styles/gallery.css'
import '../styles/index.css'
import '../styles/style.scss'
import '../styles/style-lp.scss'
import React, {useState} from 'react';
import { BeaconWallet } from "@taquito/beacon-wallet"
import Script from 'next/script'
import { createContext, useContext, useEffect } from 'react';

const AppContext = createContext(undefined);

export class SingletonBeacon {
  constructor() {
    throw 'use getInstance'
  }

  static getInstance() {
    if (!SingletonBeacon.instance && typeof window !== 'undefined') {
      SingletonBeacon.instance = new BeaconWallet({ name: 'Orbitez' })
    }
    return SingletonBeacon.instance
  }
}

export function AppWrapper({ children }) {
  const [wallet, setWallet] = useState(SingletonBeacon.getInstance());   

  useEffect(() => {
    setWallet()
  }, [])

  return (
    <AppContext.Provider value={wallet}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

function MyApp({ Component, pageProps }) {

  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  )
}

export default MyApp
