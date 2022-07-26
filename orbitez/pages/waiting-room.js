import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import { CONTRACT_ADDRESS } from '../constants'
import { useRouter } from 'next/router';
import { useTezos } from '../hooks/useTezos';
import PlanetGenerator from '../components/PlanetGenerator/PlanetGenerator';
import Header from '../components/Header/Header';

const signalR = require("@microsoft/signalr");

export default function WaitingRoom() {
    const { Tezos, address } = useTezos()
    const [waitRoom, setWaitRoom] = useState([])
    const [roomSize, setRoomSize] = useState(10)
    const [mintHash, setMintHash] = useState('')
    const router = useRouter()

    const refund = async () => {
        const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
        const serverName = localStorage.getItem('ORBITEZ_SERVER_NAME');
        const sanitized = serverName.replaceAll('"', '');
        await contract.methods.refund(sanitized, sanitized).send();
        router.push('/dashboard');
    }

    useEffect(async () => {
        const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
        const storage = await contract.storage();
        const serverName = localStorage.getItem('ORBITEZ_SERVER_NAME');
        setMintHash(localStorage.getItem('mintHash'));
        const sanitized = serverName.replaceAll('"', '');
        console.log(serverName);
        console.log(Number(storage.room.valueMap.get(serverName).size));
        setRoomSize(Number(storage.room.valueMap.get(serverName).size));
        const players = [];
        for (let [key, value] of storage.player.valueMap) {
            console.log(value)
            if (value.room_id === sanitized) { 
                players.push(key.replaceAll('"', ''))
            }
        }
        console.log(waitRoom.length);
        setWaitRoom(players);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.ghostnet.tzkt.io/v1/events") //https://api.tzkt.io/ MAINNEt
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
            console.log(msg)
            if (msg?.data?.[0]?.storage?.player) {
                const players = []
                const playersObject = msg?.data?.[0]?.storage?.player
                for (let [key, value] of playersObject) {
                    console.log(value)
                    if (value.room_id === sanitized) { 
                        players.push(key.replaceAll('"', ''))
                    }
                }
                setWaitRoom(players)
            } 
        });

        init();
    }, [])


    return (
        <div className="background">
            <Head>
                <title>Waiting room - Orbitez.io</title>
            </Head>
            
            <Header/>

            <main className="page container">
                <div className="page__left">
                    <div className="listBlock">
                        <h2 className="listBlock__title blockTitle">{waitRoom.length ? `Waiting for players ${waitRoom.length} / ${roomSize}` : 'Loading players list...'}</h2>
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
                        <PlanetGenerator mint_hash={mintHash} />
                        <a
                            style={{
                                opacity: waitRoom.length === roomSize ? 1 : 0.3,
                                cursor: waitRoom.length === roomSize ? 'pointer' : 'not-allowed'
                            }}
                            disabled={waitRoom.length < roomSize}
                            className="planet__btn btn btn--center"
                            onClick={() => router.push({
                                pathname: '/hud'
                            })}
                        >
                            Start Game
                        </a>
                        <a className="btn btn--center" onClick={() => refund()} >Leave room</a>
                    </div>
                </div>

                <div className="page__right">

                </div>
            </main>
        </div>
    )
}