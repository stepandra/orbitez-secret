import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { CONTRACT_ADDRESS } from '../constants'
import { useRouter } from 'next/router';
import { useTezos } from '../hooks/useTezos';
const signalR = require("@microsoft/signalr");
import axios from 'axios';

export default function Hud() {
    const { Tezos, address } = useTezos()
    const [waitRoom, setWaitRoom] = useState([])
    const router = useRouter()

    const refund = async () => {
        const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
        await contract.methods.refund(address).send()
        router.push('/dashboard')
    }
    
    useEffect(() => {
        axios.get(`https://api.hangzhou2net.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/storage`).then(res => {
            setWaitRoom(Object.keys(res.data.players))
        })
        const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://api.hangzhou2net.tzkt.io/v1/events") //https://api.tzkt.io/ MAINNEt
        .build();
    
        async function init() {
            // open connection
            await connection.start();
            // subscribe to head
            await connection.invoke("SubscribeToBlocks"); 
    
            await connection.invoke('SubscribeToOperations', {
              address: CONTRACT_ADDRESS,
              types: 'transaction'
            })
        };
    
        // auto-reconnect
        connection.onclose(init);
    
        connection.on("blocks", (msg) => {
            console.log('BLKS',msg);            
        });
    
        connection.on("operations", (msg) => {
          if (msg?.data?.[0]?.storage?.players) {
            const playersObject = msg?.data?.[0]?.storage?.players
            console.log('settingWaitRoom', Object.keys(playersObject))
            setWaitRoom(Object.keys(playersObject))
          }
          console.log('TRANS', msg);            
      });
    
        init();
      }, [])


    return (
        <body className="background">
            <Head>
                <meta charset="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Waiting room - Orbitez.io</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <header className="header">
                <h1 className="header__title">Waiting room</h1>
            </header>
            
            <main className="page container">
                <div className="page__left">
                    <div className="listBlock">
                        <h2 className="listBlock__title blockTitle">{waitRoom.length ? `Waiting for players ${waitRoom.length} / 10` : 'Loading players list...' }</h2>
                        <ul className="listBlock__list">
                            {
                                waitRoom.map(el => el === address 
                                    ? <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', wordWrap: 'nowrap' }} className="listBlock__item listBlock__item--active">{el}</li>
                                    : <li style={{ overflow: 'hidden' }} className="listBlock__item">{el}</li>
                                )
                            }
                        </ul>
                    </div>
                </div>

                <div className="page__center">
                    <div className="planet">
                        <img className="planet__img" src="/img/planet.png" alt="planet background" />
                        <button 
                            style={{ 
                                opacity: waitRoom.length === 10 ? 1 : 0.3, 
                                cursor: waitRoom.length === 10 ? 'pointer' : 'not-allowed' 
                            }} 
                            disabled={waitRoom.length < 10} 
                            className="planet__btn btn btn--center btn--neon"
                            onClick={() => router.push('/hud')}
                        >
                            Start Game
                        </button>
                        <a className="btn btn--center" onClick={() => refund()} >Leave room</a>
                    </div>
                </div>

                <div className="page__right">
                    
                </div>
            </main>
        </body>
    )
}