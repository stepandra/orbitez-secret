import React from 'react';
import Head from 'next/head'
import { useTezos } from '../hooks/useTezos';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Landing() {
    const { connectWallet, disconnectWallet, address, Tezos, balance } = useTezos()
    const router = useRouter()
    const joinGame = async () => {
        if (address == '') {
            await connectWallet()
        }
        router.push('/dashboard')
    }

    const deployServer = () => {
        axios.get('/api/deploy_orbitez_do')
    }

    return (
        <>
            <Head>
                <title>Orbitez.io</title>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff" />
            </Head>
            
            <main className='lp container container--small'>
                <div className='lp__content'>
                    <img className="lp__logo" src="/img/logo-big.png" alt="Logo" />
                    <p className="lp__text">Fight with players from all over the world as you try to become the biggest Planet in a solar system! Control your tiny planet and eat other players to grow larger. Mint your own, unique generative planet as NFT to enter the battlefield!</p>
                    <Link href="/dashboard">
                        <a className="lp__btn btn btn--center btn--neon">Join the game</a>
                    </Link>
                </div>
                <div className='lp__bg'>
                    <video className="lp__video" loop muted autoPlay poster={"/img/lp-bg-poster.png"}>
                        <source src="/video/lp-bg-video-6.mp4" type="video/mp4" />
                        <source src="/video/lp-bg-video-8.webm" type="video/webm" />
                    </video>
                    <div className="lp__overlay"></div>
                </div>
            </main>
        </>
    )
}

