import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from '../constants';
import axios from 'axios';
import { renderInner } from '../components/agar-client/agar-client-html';
import Script from 'next/script'
const signalR = require("@microsoft/signalr");

export default function Hud() {
    const [endBlock, setEndBlock] = useState(null)
    const [server, setServer] = useState('ws.orbitez.io')
    const [currentBlock, setCurrentBlock] = useState(0)
    const router = useRouter()

    const isGameLive = () => endBlock === null || currentBlock <= Number(endBlock)

    useEffect(() => {
        const ls_server = localStorage.getItem('ORBITEZ_SERVER_URL') || 'ws.orbitez.io'
        const gateway = localStorage.getItem('ipfs-gateway') || 'gateway.ipfs.io'
        setServer(ls_server)
        if (!localStorage.getItem('skinLink')) {
            localStorage.setItem('skinLink', `https://${gateway}/ipfs/QmaXjh2fxGMN4LmzmHMWcjF8jFzT7yajhbHn7yBN7miFGi`)
            router.reload()
        }
    }, [])

    useEffect(() => {
        if (!isGameLive()) {
            router.push('/last-game-stats')
        }
    }, [currentBlock])

    useEffect(() => {
        setTimeout(() => {
            window.init()
        }, 100);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.ithacanet.tzkt.io/v1/events") //https://api.tzkt.io/ MAINNEt
            .build();

        const serverName = localStorage.getItem('ORBITEZ_SERVER_NAME')
        const sanitized = serverName.replaceAll('"', '')

        axios.get(`https://api.ithacanet.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/storage`).then(res => {
            console.log(res.data)
            setEndBlock(res.data.room[sanitized].finish_block)
        })

        async function init() {
            // open connection
            await connection.start();
            // subscribe to head
            await connection.invoke("SubscribeToBlocks");

        };

        // auto-reconnect
        connection.onclose(init);

        connection.on("blocks", (msg) => {
            console.log('block', msg.state)
            setCurrentBlock(msg.state)
        });

        init();

        return 
    }, [])

    return (
        <>
            <Head>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Hud - Orbitez.io</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#1a113c" />
            </Head>
            <Script src="/assets/js/quadtree.js" strategy="beforeInteractive"></Script>
            <Script src="/assets/js/main_out.js" strategy="beforeInteractive"></Script>

            <header className="header header--hud">
                <div className="blocksTimer">
                    <div className='blocksTimer__num'>{endBlock - currentBlock}</div>
                    <div className='blocksTimer__text'>BLOCKS</div>
                </div>

                {/* <div className="dashboard dashboard--hud">
                    <div className="dashboard__icon">
                        <Link href="/dashboard">
                            <a className="dashboard__link" >
                                <img className="dashboard__img" src="/img/icon-home.png" alt="Home icon" />
                            </a>
                        </Link>
                    </div>
                    <div className="dashboard__info">
                        <p className="dashboard__text">SCORE</p>
                        <p className="dashboard__num">35000</p>
                    </div>
                </div> */}
            </header>
            
            <main className='hud' dangerouslySetInnerHTML={ isGameLive ? renderInner(server) : null } ></main>
        </>
    )
}
