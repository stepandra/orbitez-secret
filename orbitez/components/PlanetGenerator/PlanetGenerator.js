
import React, {useEffect, useState} from 'react';
import { InnerHtml } from './innerHtml';
import Head from 'next/head'
import Shaders from './Shaders'

export default function PlanetGenerator() {  
  useEffect(() => {
    setTimeout(() => {
        window.initPlanet('opXb1R5Gsojdj45VM5NmJP1M6yQcpyjh2JTvWBjUX1DvVJG42KK')
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