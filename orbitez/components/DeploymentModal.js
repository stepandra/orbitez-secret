import React, { useState } from 'react';
import DigitalOceanDeployment from './DigitalOceanDeployment'

export default function DeploymentModal({ closeModal }) {
  
  return (
    <div className='modal-background'>
      <div className='modal-content'>
        <div className='close' onClick={() => closeModal()}>X</div>
        <h2 style={{ width: '100%', margin: '2rem', textAlign: 'center'}}>Deploy your own Orbitez server and Tezos node</h2>
        
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap'}}>
          <DigitalOceanDeployment />
          <div style={{  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: 300}}>
              <img width={200} src='https://futurumresearch.com/wp-content/uploads/2020/01/aws-logo.png' />
              coming soon
          </div>
          <div style={{  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: 300}}>
              <img width={200} src='https://cloud.google.com/_static/cloud/images/social-icon-google-cloud-1200-630.png' />
              coming soon
          </div>
          <div style={{  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: 300}}>
              <img width={200} src='https://www.switchautomation.com/wp-content/uploads/2021/06/Microsoft_Azure-Logo.wine_.png' />
              coming soon
          </div>
        </div>
      </div>
    </div>
  )
}