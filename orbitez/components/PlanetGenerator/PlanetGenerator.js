import React, {useEffect, useState} from 'react';
import { InnerHtml } from './innerHtml';
import Head from 'next/head'
import Shaders from './Shaders'
import Script from 'next/script'

export default function PlanetGenerator(props) { 
  const [shouldGeneratePlanet, setShouldGeneratePlanet] = useState(false) 
  // console.log(props.mint_hash);
  useEffect(() => {
    if (shouldGeneratePlanet && props.mint_hash) {
      localStorage.setItem('fxHash', props.mint_hash)
      window.initPlanet(props.mint_hash);
    }
  }, [props.mint_hash])

  return (
    <div>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Dosis|Raleway" rel="stylesheet" />
      </Head>
      <Shaders />
      <Script src="/webgl/main.js" 
        strategy='afterInteractive'
        onLoad={() => {
          setShouldGeneratePlanet(true)
        }}></Script>
      <div dangerouslySetInnerHTML={InnerHtml} ></div>
      {!props.mint_hash && <p>Loading NFT, please wait...</p>}
    </div>
  )
}