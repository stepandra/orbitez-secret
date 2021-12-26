import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from '../constants';
import axios from 'axios';
import { renderInner } from '../components/agar-client/agar-client-html';
const signalR = require("@microsoft/signalr");

export default function Hud() {
    const [endBlock, setEndBlock] = useState(null)
    const [currentBlock, setCurrentBlock] = useState(0)
    const router = useRouter()

    const isGameLive = endBlock === null || currentBlock <= Number(endBlock)

    useEffect(() => {
        if (!isGameLive) {
            router.push('/last-game-stats')
        }
    }, [isGameLive])

    useEffect(() => {
        setTimeout(() => {
            window.init()
        }, 100);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.hangzhou2net.tzkt.io/v1/events") //https://api.tzkt.io/ MAINNEt
            .build();

        axios.get(`https://api.hangzhou2net.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/storage`).then(res => {
            setEndBlock(res.data.end_block)
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
            setCurrentBlock(msg.state)
        });

        init();

        return 
    }, [])

    return (
        <div className="bgImageNone">
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
                <script src="/assets/js/quadtree.js"></script>
                <script src="/assets/js/main_out.js"></script>
            </Head>

            <header className="header hud-header">
                <div className="blocksTimer">
                    {currentBlock >= endBlock ? endBlock - currentBlock : 0}
                </div>

                <div className="dashboard">
                    <div className="dashboard__icon">
                        <a className="dashboard__link" href="">
                            <img className="dashboard__img" src="/img/icon-home.png" alt="Home icon" />
                        </a>
                    </div>
                    <div className="dashboard__info">
                        <p className="dashboard__text">SCORE</p>
                        <p className="dashboard__num">35000</p>
                    </div>
                </div>
            </header>
            <div dangerouslySetInnerHTML={ isGameLive ? renderInner() : null } ></div>
            <main className='page container container--big'>
               
            </main>
        </div>
    )
}
