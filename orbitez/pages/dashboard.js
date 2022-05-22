import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTezos } from '../hooks/useTezos'
import { CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from '../constants'
import Link from 'next/link';
import axios from 'axios';
import PlanetGenerator from '../components/PlanetGenerator/PlanetGenerator';
import DeploymentModal from '../components/DeploymentModal'

const DEFAULT_PLANET_FEATURES = {
    habitability: 0,
    size: 0,
    age: 0,
    gravity: 0,
    exoplanet: false
}

export default function Dashboard() {
    const { connectWallet, disconnectWallet, address, Tezos, balance } = useTezos()
    const router = useRouter()
    const [mintHash, setMintHash] = useState('');
    const [planetsAvailable, setPlanetsAvailable] = useState([])
    const [planetSelected, setPlanetSelected] = useState(0)
    const [planetFeatures, setPlanetFeatures] = useState(DEFAULT_PLANET_FEATURES)
    const [isDemoMode, setIsDemoMode] = useState(false)
    const [deploymentModalOpen, setDeploymentModalOpen] = useState(false)
    const [selectedServerIndex, setSelectedServerIndex] = useState(undefined)
    const [serverList, setServerList] = useState([])

    const promisify = (gateway) => {
        return new Promise((resolve, reject) => {
            try {
                axios.get(`https://${gateway}/ipfs/QmaXjh2fxGMN4LmzmHMWcjF8jFzT7yajhbHn7yBN7miFGi`).then(res => {
                    console.log(res.status)
                    resolve(gateway)
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                reject()
            }
        })
    }

    const ipfsRace = async () => {
        const ipfsGateways = [
            'gateway.ipfs.io',
            'ipfs.io',
            'infura-ipfs.io',
            'cloudflare-ipfs.com',
            'dweb.link',
            'ipfs.fleek.co',
            'ipfs.lain.la',
            'nftstorage.link',
            'ipfs.infura.io',
            'ipfs.telos.miami',
            'ipfs.eth.aragon.network',
            'via0.com',
            'gateway.pinata.cloud',
        ]

        const promiseList = []

        for (let gateway of ipfsGateways) {
            promiseList.push(promisify(gateway))
        }

        const winner = await Promise.race(promiseList)
        localStorage.setItem('ipfs-gateway', winner)
    }

    useEffect(async () => {
        ipfsRace()
        const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
        const storage = await contract.storage()
        const contractServerList = []
        for (let [key, value] of storage.server.valueMap) {
            contractServerList.push({...value, name: key})
        }

        setServerList(contractServerList)
        let ls_server = localStorage.getItem('ORBITEZ_SERVER_URL')
        if (ls_server) {
            for (let i = 0; i < contractServerList.length; i++) {
                if (contractServerList[i].server_url === ls_server) {
                    setSelectedServerIndex(i)
                    break
                }
            }
        } else {
            setSelectedServerIndex(0)
        }
    }, [])
   
    setTimeout(async () => {
        let gateway
        if (typeof window !== 'undefined')
            gateway = localStorage.getItem('ipfs-gateway') || 'gateway.ipfs.io'
        else {
            gateway = 'gateway.ipfs.io'
        }
        !planetsAvailable.length && fetch("https://api.fxhash.xyz/graphql", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
            },
            body: JSON.stringify({ query: '{generativeToken(slug: "Orbitoid", id: 3808) {entireCollection {id owner {id} generationHash metadata }}}' })
        })
        .then(res => res.json())
        .then(res => {
            const owners_ids = res.data?.generativeToken?.entireCollection;
            const planets = []
            owners_ids.map((post) => {
                if(post.owner.id == address) {
                    planets.push({
                        img_link: `https://${gateway}/ipfs` + post.metadata.displayUri.slice(6),
                        gen_hash: post.metadata.iterationHash,
                        token_id: post.id
                    })
                }
            });
            if (!planets.length) {
                planets.push({
                    gen_hash: "ooKg2zuJu9XhZBRKQaBrEDvpeYZjDPmKREp3PMSZHLkoSFK3ejN",
                    img_link: `https://${gateway}/ipfs/QmaXjh2fxGMN4LmzmHMWcjF8jFzT7yajhbHn7yBN7miFGi`,
                    token_id: 'DEMO PLANET'
                })
            }            
            setPlanetsAvailable(planets)
        });
    }, 2000)

    useEffect(() => {
        if (typeof selectedServerIndex == 'undefined' || !serverList.length) return
        localStorage.setItem('ORBITEZ_SERVER_URL', serverList[selectedServerIndex].server_url)
        localStorage.setItem('ORBITEZ_SERVER_NAME', serverList[selectedServerIndex].name)
    }, [selectedServerIndex])

    useEffect(() => {
        if (planetsAvailable?.[planetSelected]) {
            const selected = planetsAvailable[planetSelected]
            if (selected.token_id === 'DEMO PLANET') {
                setIsDemoMode(true)
            } else {
                setIsDemoMode(false)
            }
            setMintHash(selected.gen_hash);
            localStorage.setItem('mintHash', selected.gen_hash)
            localStorage.setItem('skinLink', selected.img_link)
        }
    }, [planetSelected, planetsAvailable])

    useEffect(() => {
        window.$fxhashFeatures && setPlanetFeatures(window.$fxhashFeatures)
    }, [mintHash])
    
    const enterRoom = async () => {
        const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);

        try {
            await contract.methods.enter_room(serverList[selectedServerIndex]?.name.replaceAll('"', ''), serverList[selectedServerIndex]?.name.replaceAll('"', '')).send({ storageLimit: 1000, amount: 1 })
            router.push('/waiting-room')
        } catch (e) {
            console.log('Transaction rejected:', e)
        }
    }

    const demoHud = async () => {
        router.push('/hud')
    }

    const mintOnFx = async () => {
        const contract = await Tezos.wallet.at(NFT_CONTRACT_ADDRESS);
        try {
            await contract.methods.mint("tz1iJJPGh7arygfq5EC2sBaAF23T8iUYTpEH", 3808).send({ amount: 1 })

            // router.push('/waiting-room')
        } catch (e) {
            console.log('Transaction rejected:', e)
        }
    }

    const openDeploymentModal = async () => {
        if (!address) connectWallet()
        setDeploymentModalOpen(true)
    }

    return (
        <div className="background">
            <Head>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Dashboard - Orbitez.io</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <header className="header container">
                <Link href="/leaderboard">
                    <a className="header__linkLeft link">LEADERBOARD</a>
                </Link>
                <h1 className="header__title">Dashboard</h1>
                <div className="header__dashboard dashboard">
                    <div className="dashboard__icon">
                        <a className="dashboard__link" onClick={() => disconnectWallet()}>
                            <img className="dashboard__img" src="/img/icon-exite.png" alt="Home icon" />
                        </a>
                    </div>
                    <div className="dashboard__info">
                        <p onClick={() => connectWallet()} className="dashboard__text">{address == '' ? 'CONNECT WALLET' : 'BALANCE'}</p>
                        {address != '' && <p className="dashboard__num"><span className='dashboard__symbol'>ꜩ</span>{balance.toFixed(3)}</p>}
                    </div>
                </div>
            </header>
            
            <main className='page container'>
                <div className="page__left">
                    <div className="listBlock">
                        <h2 className="listBlock__title">Select Planet</h2>
                        {
                            planetsAvailable.length > 0 && 
                            <ul className="listBlock__list">
                                {
                                planetsAvailable.map((planet, index) => 
                                    <li 
                                        key={'planet' + planet.token_id}
                                        onClick={() => setPlanetSelected(index)} 
                                        className={`listBlock__item ${index === planetSelected ? 'listBlock__item--active' : ''}`}
                                        >
                                        { planet.token_id }
                                    </li> 
                                    )
                                }
                            </ul>
                        }
                        {
                            !planetsAvailable.length && <p className="listBlock__text">{`Uh oh, Looks like you haven't minted any planet NFTs...`}</p>
                        }
                    </div>
                    { address !== '' && <a className="btn btn--wide" onClick={() => window.open("https://www.fxhash.xyz/marketplace/generative/3808", "_blank")}>MINT NEW NFT</a>}

                    <div className="payMethod" style={{ marginTop: '10rem' }}>
                        <h3 className="payMethod__title">Payment method</h3>
                        <div className="payMethod__switcher">
                            <img className="payMethod__prev" src='/img/icon-prev.png'></img>
                            <p className="payMethod__item">LP Token</p>
                            <img className="payMethod__next" src='/img/icon-prev.png'></img>
                        </div>
                    </div>
                </div>

                <div className="page__center">
                    <div className="planet planet--bgCircle">
                        <PlanetGenerator mint_hash={mintHash} />
                        <a onClick={() => { 
                            address == '' ? connectWallet() : isDemoMode ? demoHud() : enterRoom() 
                        }} className="planet__btn btn btn--center btn--neon" >
                            {
                                address == ''
                                ? 'Connect wallet'
                                : ( isDemoMode ) 
                                    ? 'Demo gameplay'
                                    : 'PLAY 1 XTZ'
                            }
                        </a>
                    </div>
                </div>

                <div className="page__right">
                    <div className="listBlock">
                        <h2 className="listBlock__title">Statistics</h2>
                        <ul className="listBlock__list">
                            {
                                Object.keys(planetFeatures).map(
                                    key => <li key={'features-'+key} className="listBlock__item">{key.toUpperCase()} <span>{planetFeatures[key]}</span></li>
                                )
                            }
                        </ul>
                    </div>
                    <div className="listBlock">
                        <h2 className="listBlock__title">Deployments</h2>
                        <div className="">
                            <a className="planet__btn btn btn--center btn--neon" 
                                onClick={() => { openDeploymentModal() }}>
                                <span>Deploy Server</span>
                            </a>
                        </div>
                    </div>
                    <div className="payMethod" style={{ cursor: 'default' }}>
                        <h3 className="payMethod__title">Select server</h3>
                        <div className="payMethod__switcher">
                            <img className="payMethod__prev" style={{ cursor: 'pointer' }} src='/img/icon-prev.png' onClick={() => selectedServerIndex > 0 && setSelectedServerIndex(selectedServerIndex - 1)}></img>
                            <p className="payMethod__item">{serverList[selectedServerIndex]?.name}</p>
                            <img className="payMethod__next" style={{ cursor: 'pointer' }} src='/img/icon-prev.png' onClick={() => selectedServerIndex < serverList.length - 1 && setSelectedServerIndex(selectedServerIndex + 1)}></img>
                        </div>
                    </div>
                    {/* <a className="btn btn--wide" href="/waiting-room">PLAY 1 XTZ</a>
                    <a className="btn btn--wide btn--second" href="/waiting-room">PLAY 10 XTZ</a> */}
                </div>
            </main>
            {deploymentModalOpen && <DeploymentModal closeModal={() => setDeploymentModalOpen(false)}/>}
        </div>
    )
}

