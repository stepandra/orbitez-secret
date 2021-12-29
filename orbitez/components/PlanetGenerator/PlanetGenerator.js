import React, { useEffect, useState } from 'react';
import { InnerHtml } from './innerHtml';
import Head from 'next/head'
import Shaders from './Shaders'
import Script from 'next/script'

export default function PlanetGenerator(props) {
  const [isMainReady, setIsMainReady] = useState(false)
  const [isJqReady, setIsJqReady] = useState(false)
  const [isSeedReady, setIsSeedReady] = useState(false)

  // console.log(props.mint_hash);
  useEffect(() => {
    setTimeout(() => {
      if (isJqReady && isMainReady && isSeedReady && props.mint_hash) {
        localStorage.setItem('fxHash', props.mint_hash)
        window.initPlanet(props.mint_hash);
      }
    }, 750)
  }, [props.mint_hash])

  return (
    <div>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Dosis|Raleway" rel="stylesheet" />
      </Head>
      <Shaders />
      <Script src="/jquery-3.2.0.min.js"
        strategy='afterInteractive'
        onLoad={() => {
          setIsJqReady(true)
        }}
      ></Script>
      <Script src="/seedrandom.js"
        strategy='afterInteractive'
        onLoad={() => {
          setIsSeedReady(true)
        }}
      ></Script>

      <Script src="/webgl/main.js"
        strategy='afterInteractive'
        onLoad={() => {
          setIsMainReady(true)
        }}></Script>
      <div dangerouslySetInnerHTML={InnerHtml} ></div>
      {!props.mint_hash && <p>Loading NFT, please wait...</p>}
    </div>
  )
}
