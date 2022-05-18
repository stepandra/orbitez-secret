import React, { useEffect, useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios'

export default () => {
  const [deployTezos, setDeployTezos] = useState(true)
  const [token, setToken] = useState( localStorage.getItem('DO_TOKEN') )
  const [progress, setProgress] = useState(0)
  const [animatedText, setAnimatedText] = useState('Deploying')
  
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
    let newProgress = 5

    if (tags.includes('kv:install-started:true')) {
      newProgress = 10
    }
    if (tags.includes('kv:ngrok_ready:true')) {
      newProgress = 35
    }
    if (tags.includes('kv:node_install_started:true')) {
      newProgress = 65
    }
    if (tags.includes('kv:node_live:true')) {
      newProgress = 100
    }
    if (progress !== newProgress)
    setProgress(newProgress)
  }

  const getDroplets = async () => {
    const DO_TOKEN = localStorage.getItem('DO_TOKEN')
    if (DO_TOKEN !== '') {
      const res = await axios.post('/api/get_do_droplets', { token: DO_TOKEN })
      const { droplets } = res.data
      if (!droplets || !droplets.length) return
      const orbDroplet = droplets[0].dropletInfo
      const tags = orbDroplet.tags
      console.log('TAGS',tags)
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
    await axios.post('/api/deploy_orbitez_do', { token })
    setProgress(5)
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: 300}}>
        <img width={200} src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png' />
        {
          progress != 0 && 
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
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '1rem'}}>
              <input style={{ width: 35, marginTop: 5 }} type={'checkbox'} checked={deployTezos} onChange={() => { setDeployTezos(!deployTezos) }}/>
              <h3 onClick={() => { setDeployTezos(!deployTezos) }}>Deploy Tezos node</h3>
            </div>
          </>
        }
        <button className="planet__btn btn btn--center" 
            style={{
              margin: 10,
              fontSize: 18,
              padding: 0,
              minHeight: 45,
              cursor: progress != 0 ? 'progress' : 'pointer'
            }}
            disabled={progress != 0}
            onClick={() => { deployDOServer() }}>
            <span>{progress == 0 ? 'Deploy Server' : animatedText}</span>
        </button>
    </div>
    </>
  )
}

