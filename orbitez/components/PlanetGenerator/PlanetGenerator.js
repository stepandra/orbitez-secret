import React, {useEffect, useState} from 'react';
import { InnerHtml } from './innerHtml';
import Head from 'next/head'
import Shaders from './Shaders'

export default function PlanetGenerator(props) {  
  // console.log(props.mint_hash);
  useEffect(() => {
    setTimeout(() => {
        console.log('ZigHash: ', props.mint_hash);
        window.initPlanet(fxhash);
    }, 50);
  }, [])

  return (
    <div>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Dosis|Raleway" rel="stylesheet" />
      </Head>
      <Shaders />
     <div dangerouslySetInnerHTML={InnerHtml} ></div>
    </div>
  )
}