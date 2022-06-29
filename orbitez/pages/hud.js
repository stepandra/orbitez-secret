import React, { useEffect, useState } from 'react';

import Head     from 'next/head'
import Link     from 'next/link';
import Image    from 'next/image';
import Script   from 'next/script'

import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from '../constants';
import axios from 'axios';
import { renderInner } from '../components/agar-client/agar-client-html';

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
                <title>Hud - Orbitez.io</title>
            </Head>
            <Script src="/assets/js/quadtree.js" strategy="beforeInteractive"></Script>
            <Script src="/assets/js/main_out.js" strategy="beforeInteractive"></Script>

            <header className="header header--hud container">

                <div className="header__playersList playersList">
                    <ul className="playersList__list playersList__list--gen">
                        <li className="playersList__item">
                            <p className="playersList__num">1.</p>
                            <p className="playersList__name">Agraried</p>
                        </li>
                        <li className="playersList__item">
                            <p className="playersList__num">2.</p>
                            <p className="playersList__name">Marsofuel S5</p>
                        </li>
                        <li className="playersList__item">
                            <p className="playersList__num">3.</p>
                            <p className="playersList__name">Orbitez NN</p>
                        </li>
                        <li className="playersList__item">
                            <p className="playersList__num">4.</p>
                            <p className="playersList__name">Agraried</p>
                        </li>
                        <li className="playersList__item">
                            <p className="playersList__num">5.</p>
                            <p className="playersList__name">SilverSpoon</p>
                        </li>
                    </ul>
                    <ul className="playersList__list">
                        <li className="playersList__item playersList__item--active">12. Orbitez NN</li>
                    </ul>
                </div>

                <div className="header__mass mass">2.560 * 1022 kg</div>

                <div className="header__linkBlock">
                    <Image 
                        className="header__icon" 
                        src='/img/icon-home.png' 
                        layout="fixed" 
                        width={43} 
                        height={34}
                        alt=""
                    />
                    <Link href='/dashboard'>
                        <a className="header__link">
                            Home
                        </a>
                    </Link>
                </div>
            </header>
            
            <main className='hud' dangerouslySetInnerHTML={ isGameLive ? renderInner(server) : null } ></main>

            <footer>
                <div className="gameTimer">
                    <div className='gameTimer__num'>{endBlock - currentBlock}</div>
                    <div className='gameTimer__list'>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item gameTimer__item--active"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                        <div className="gameTimer__item"></div>
                    </div>
                </div>
            </footer>
        </>
    )
}
