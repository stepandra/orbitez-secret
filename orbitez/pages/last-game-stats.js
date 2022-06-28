import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useTezos } from '../hooks/useTezos';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from '../constants';

import Header from '../components/Header/Header';

export default function LastGameStats() {
    const { connectWallet, address, Tezos, balance } = useTezos()
    const [leaderboard, setLeaderboard] = useState([])
    const [endgameData, setEndgameData] = useState({packed: '', signed: ''})
    const router = useRouter()

    useEffect(() => {
      const getLeaderboard = async () => {
        const server = localStorage.getItem('ORBITEZ_SERVER_NAME')
        const res = await axios.post('/api/get-signed-leaderboard', { server })
        setEndgameData(res.data)
        setLeaderboard(res.data.leaderboard)
        console.log(res.data)
      }

      getLeaderboard()
    }, [])

    const payDividends = async () => {
      const server = localStorage.getItem('ORBITEZ_SERVER_NAME')
      const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
      const sanitized = server.replaceAll('"', '')
      await contract.methods.endGame(sanitized, sanitized, endgameData.packed, endgameData.sig).send({ storageLimit: 1000 })
      router.push('/dashboard')
    }

    return (
        <div className="background">
            <Head>
                <title>Game Winners - Orbitez.io</title>
            </Head>
            
            <Header />
            
            <main className='container container--small'>

                <div className="statList statList--wide">
                    <ul className="statList__list">
                      {
                        leaderboard.map((player, index) => (
                          <li key={'player-' + index} className={`statList__item ${address === player.name ? 'statList__item--active' : ''}`}>
                            <p className="statList__rank">{index + 1}</p>
                            <p className="statList__nft">{player.address}</p> 
                            <p className="statList__score">{player.amount}</p>
                          </li>
                        ))
                      }
                    </ul>
                </div>
                <a onClick={() => payDividends()} className="btn btn--center" >
                    Claim Rewards
                </a>

            </main>
        </div>
    )
}