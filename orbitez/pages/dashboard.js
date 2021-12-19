import React, { useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTezos } from '../hooks/useTezos'
import { CONTRACT_ADDRESS } from '../constants'
import Link from 'next/link';

export default function Dashboard() {
    const { connectWallet, address, Tezos, balance } = useTezos()
    const router = useRouter()

    const [planetsAvailable, setPlanetsAvailable] = useState([])
    const [planetSelected, setPlanetSelected] = useState(null)

    const mintNft = () => {
        setPlanetsAvailable([...planetsAvailable, 'NFT #123'])
    }

    const enterRoom = async () => {
        const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
        try {
            await contract.methods.enterRoom(1, true).send({ amount: 1 })
            router.push('/waiting-room')
        } catch (e) {
            console.log('Transaction rejected:', e)
        }
    }

    return (
        <div className="background">
            <Head>
                <meta charset="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Dashboard - Orbitez.io</title>
            </Head>
            <header className="header container">
                <Link className="header__link link" href="/leaderboard">LEADERBOARD</Link>
                <h1 className="header__title">Dashboard</h1>
                <div className="header__panel panel">
                    <div className="panel__icon">
                        <a className="panel__link" href="">
                            <img className="panel__img" src="/img/icon-home.png" alt="Home icon" />
                        </a>
                    </div>
                    <div className="panel__info">
                        <p style={{ cursor: 'pointer' }} onClick={() => connectWallet()} className="panel__text">{address == '' ? 'CONNECT WALLET' : 'BALANCE'}</p>
                        {address != '' && <p className="panel__num">ꜩ{balance.toFixed(3)}</p>}
                    </div>
                </div>
            </header>
            
            <main className='page container'>
                <div className="page__left">
                    <div className="listBlock">
                        <h2 className="listBlock__title">Select Planet</h2>
                        <ul className="listBlock__list">
                            {
                                planetsAvailable.map(planet => 
                                    <li 
                                        key={'planet' + planet}
                                        onClick={() => setPlanetSelected(planet)} 
                                        className={`listBlock__item ${planet === planetSelected ? 'listBlock__item--active' : ''}`}
                                    >
                                        { planet }
                                    </li> 
                                )
                            }
                            {
                                !planetsAvailable.length && <p className="panel__text">{`Uh oh, Looks like you haven't minted any planet NFTs...`}</p>
                            }
                        </ul>
                    </div>
                    { address !== '' && <a className="btn btn--wide" onClick={() => mintNft()}>MINT NEW NFT</a>}
                </div>

                <div className="page__center">
                    <div className="planet planet--bgCircle">
                        <img className="planet__img" src="/img/planet.png" alt="planet background" />
                        <a onClick={() => { 
                            address == '' ? connectWallet() : enterRoom() 
                        }} className="planet__btn btn btn--center" >
                            {
                                address == ''
                                ? 'Connect wallet'
                                : ( !planetsAvailable.length ) 
                                    ? 'Mint new NFT'
                                    : 'PLAY 0.001 XTZ'
                            }
                        </a>
                    </div>
                </div>

                <div className="page__right">
                    <div className="listBlock">
                        <h2 className="listBlock__title">Statistics</h2>
                        <ul className="listBlock__list">
                            <li className="listBlock__item">Matter eaten <span>12345</span></li>
                            <li className="listBlock__item">Highest mass <span>12345</span></li>
                            <li className="listBlock__item">Time alive <span>12:45</span></li>
                            <li className="listBlock__item">On leaderboard <span>0:43</span></li>
                            <li className="listBlock__item">Planets eaten <span>134</span></li>
                            <li className="listBlock__item">Top position <span>134</span></li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}

