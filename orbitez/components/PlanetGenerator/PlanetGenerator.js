
import React from 'react';
import { InnerHtml } from './innerHtml';
import Head from 'next/head'
import Shaders from './Shaders'

export default () => {
  return (
    <div>
      <Head>
        <script src="/jquery-3.2.0.min.js"></script>
        <script src="/seedrandom.js"></script>
        <link href="https://fonts.googleapis.com/css?family=Dosis|Raleway" rel="stylesheet" />
      </Head>
      <Shaders />
      <div dangerouslySetInnerHTML={InnerHtml} ></div>
    </div>
  )
}