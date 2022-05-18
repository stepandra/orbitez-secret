import React, { useEffect, useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios'

export default function DigitalOceanDeployment() {
  const [deployTezos, setDeployTezos] = useState(true)
  const [requestedParams, setRequestedParams] = useState({ requestedNode: true })
  const [token, setToken] = useState( localStorage.getItem('DO_TOKEN') )
  const [progress, setProgress] = useState(0)
  const [animatedText, setAnimatedText] = useState('Deploying')
  const [orbitezNgrokUrl, setOrbitezNgrokUrl] = useState('')

  const getDroplets = async () => {
    const DO_TOKEN = localStorage.getItem('DO_TOKEN')
    if (DO_TOKEN !== '') {
      const res = await axios.post('/api/get_do_droplets', { token: DO_TOKEN })
      const { droplets } = res.data
      if (!droplets || !droplets.length) return
      const orbDroplet = droplets[0].dropletInfo
      const tags = orbDroplet.tags
      tags.push(orbDroplet.status)

      const ngrok_matches = tags.filter(s => s.includes('NGROK_URL'))  
      if (ngrok_matches.length) {
        const regex = /(?<=kv:NGROK_URL:).*/
        const match = ngrok_matches[0].match(regex)
        if (match.length) {
          setOrbitezNgrokUrl(match[0])
        }
      }
      setProgressBarFromTags(tags)
    }
  }

  const pollStatus = () => {
    getDroplets()

    setTimeout(() => {
      pollStatus()
    }, 5000)
  } 

  useEffect(() => {
    updateText()
    pollStatus()
  }, [])

  const deployDOServer = async () => {
    setRequestedParams({ requestedNode: deployTezos })
    await axios.post('/api/deploy_orbitez_do', { token, deployTezos })
    setProgress(5)
  }

  const updateText = (n = 1) => {
    let dotCount = n
    if (n > 3) {
      dotCount = 1
    }
    setTimeout(() => {
      setAnimatedText('Deploying' +  '.'.repeat(dotCount))
      updateText(dotCount + 1)
    }, 500)
  }

  useEffect(() => {
    localStorage.setItem('DO_TOKEN', token)
  },[token])

  const setProgressBarFromTags = (tags) => {
    const requestedNodeToo = requestedParams.requestedNode
    let newProgress = 5
    if (tags.includes('new')) {
      newProgress = 9
    }
    if (tags.includes('active')) {
      newProgress = 15
    }
    if (tags.includes('kv:install-started:true')) {
      newProgress = requestedNodeToo ? 30 : 60
    }
    if (tags.includes('kv:ngrok_ready:true')) {
      newProgress = requestedNodeToo ? 35 : 100
    }
    if (tags.includes('kv:node_install_started:true')) {
      newProgress = 85
    }
    if (tags.includes('kv:node_live:true')) {
      newProgress = 100
    }
    if (progress !== newProgress)
    setProgress(newProgress)
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: 300}}>
        <img width={progress === 100 ? 100 : 200} src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png' />
        {
          progress !== 100 && requestedParams.requestedNode && <p style={{ textAlign: 'center' }}>The deployment of new Orbitez server and Tezos node takes about 90 min.</p>
        }
        {
          progress !== 100 && !requestedParams.requestedNode && <p style={{ textAlign: 'center' }}>The deployment of a new Orbitez server will take roughly 15 min.</p>
        }
        {
          progress != 0 && progress !== 100 && 
          <>
            <div style={{ width: '80%'}}>
              <ProgressBar completed={progress} />
            </div>
          </>
        }
        {
          progress == 0 &&
          <>
            <input value={token} onChange={e => setToken(e.target.value)} style={{ width: '65%' }} placeholder='DigitalOcean read/write token' />
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '1rem'}} onClick={e => setDeployTezos(!deployTezos)}>
              <input style={{ width: 35, marginTop: 5 }} type={'checkbox'} checked={deployTezos}/>
              <h3 >Deploy Tezos node</h3>
            </div>
          </>
        }
        {
          progress !== 100 && 
          <button className="planet__btn btn btn--center" 
            style={{
              margin: 10,
              fontSize: 18,
              padding: 0,
              minHeight: 45,
              cursor: progress != 0 ? 'progress' : 'pointer'
            }}
            disabled={progress != 0}
            onClick={() => { deployDOServer() }}
          >
            <span>{progress == 0 ? 'Deploy Server' : animatedText}</span>
          </button>
        }
       {
          (progress === 100 && requestedParams.requestedNode) && 
          <>
            <p style={{ width: '85%' }}>Your own Tezos Node is live. Add the following RPC to your wallet:</p>
            <p></p>
          </>
        }
        {
          progress === 100 && 
          <>
            <p style={{ width: '85%' }}>Your game server is ready! Hit activate button to start receiving rewards for every game hosted on your server.</p>
            <button className="planet__btn btn btn--center" >
              Activate
            </button>
          </>
        }
    </div>
    </>
  )
}

