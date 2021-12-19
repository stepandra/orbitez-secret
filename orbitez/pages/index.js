import React from 'react';
import Head from 'next/head'
import { useTezos } from '../hooks/useTezos';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Landing() {
    const { connectWallet, disconnectWallet, address, Tezos, balance } = useTezos()
    const router = useRouter()
    const joinGame = async () => {
        if (address == '') {
            await connectWallet()
        }
        router.push('/dashboard')
    }

    return (
        <div>
            <Head>
                <meta charset="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Orbitez.io</title>
            </Head>
            
            <header className="header container">
                <Link className="header__link link" href="/leaderboard">LEADERBOARD</Link>
                {address !== '' && <a className="header__link link" onClick={() => disconnectWallet()}>LOGOUT</a>}
            </header>
            
            <main className='lp container container--small'>
                <img className="lp__logo" src="/img/logo.png" alt="Logo" />
                <p className="lp__text">Fight with players from all over the world as you try to become the biggest Planet in a solar system! Control your tiny planet and eat other players to grow larger. Mint your own, unique generative planet as NFT to enter the battlefield!</p>
                <a className="lp__btn btn btn--center btn--neon" onClick={() => joinGame()}>Join the game</a>
            </main>

            <video className="bgVideo__video" loop="true" muted="true" autoPlay="true" poster="/img/lp-bg-poster.png">
                <source src="/video/lp-bg-video-6.mp4" type="video/mp4" />
                <source src="/video/lp-bg-video-8.webm" type="video/webm" />
            </video>
            <div className="bgVideo__overlay"></div>
        </div>
    )
}

