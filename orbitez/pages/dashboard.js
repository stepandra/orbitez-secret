import React, { useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTezos } from '../hooks/useTezos'
import { CONTRACT_ADDRESS } from '../constants'


export default function dashboard() {
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
        <div class="background">
            <Head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Dashboard - Orbitez.io</title>
            </Head>
            <header class="header container">
                <a class="header__link link" href="/leaderboard">LEADERBOARD</a>
                <h1 class="header__title">Dashboard</h1>
                <div class="header__panel panel">
                    <div class="panel__icon">
                        <a class="panel__link" href="">
                            <img class="panel__img" src="/img/icon-home.png" alt="Home icon" />
                        </a>
                    </div>
                    <div class="panel__info">
                        <p style={{ cursor: 'pointer' }} onClick={() => connectWallet()} class="panel__text">{address == '' ? 'CONNECT WALLET' : 'BALANCE'}</p>
                        {address != '' && <p class="panel__num">ꜩ{balance.toFixed(3)}</p>}
                    </div>
                </div>
            </header>
            
            <main class='page container'>
                <div class="page__left">
                    <div class="listBlock">
                        <h2 class="listBlock__title">Select Planet</h2>
                        <ul class="listBlock__list">
                            {
                                planetsAvailable.map(planet => 
                                    <li 
                                        onClick={() => setPlanetSelected(planet)} 
                                        class={`listBlock__item ${planet === planetSelected ? 'listBlock__item--active' : ''}`}
                                    >
                                        { planet }
                                    </li> 
                                )
                            }
                            {
                                !planetsAvailable.length && <p class="panel__text">Uh oh, Looks like you haven't minted any planet NFTs...</p>
                            }
                        </ul>
                    </div>
                    { address !== '' && <a class="btn btn--wide" onClick={() => mintNft()}>MINT NEW NFT</a>}
                </div>

                <div class="page__center">
                    <div class="planet planet--bgCircle">
                        <img class="planet__img" src="/img/planet.png" alt="planet background" />
                        <a onClick={() => { 
                            address == '' ? connectWallet() : enterRoom() 
                        }} class="planet__btn btn btn--center" >
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

                <div class="page__right">
                    <div class="listBlock">
                        <h2 class="listBlock__title">Statistics</h2>
                        <ul class="listBlock__list">
                            <li class="listBlock__item">Matter eaten <span>12345</span></li>
                            <li class="listBlock__item">Highest mass <span>12345</span></li>
                            <li class="listBlock__item">Time alive <span>12:45</span></li>
                            <li class="listBlock__item">On leaderboard <span>0:43</span></li>
                            <li class="listBlock__item">Planets eaten <span>134</span></li>
                            <li class="listBlock__item">Top position <span>134</span></li>
                        </ul>
                    </div>
                    {/* <a class="btn btn--wide" href="/waiting-room">PLAY 1 XTZ</a>
                    <a class="btn btn--wide btn--second" href="/waiting-room">PLAY 10 XTZ</a> */}
                </div>
            </main>
        </div>
    )
}

