import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useTezos } from '../hooks/useTezos';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from '../constants';

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
            <header className="header container">
                <Link href={'/'}>
                    <a className="header__logo logo">
                        <img className="header__logoImg" src='/img/logo-2x.png' ></img>
                    </a>
                </Link>
                <h1 className="header__title">Last Game Winners</h1>
                <div className="header__dashboard dashboard">
                    <div className="dashboard__icon">
                        <Link href="/dashboard">
                            <a className="dashboard__link" >
                                <img className="dashboard__img" src="/img/icon-home.png" alt="Home icon" />
                            </a>
                        </Link>
                        
                    </div>
                    <div className="dashboard__info">
                        <p onClick={() => connectWallet()} className="dashboard__text">{address == '' ? 'CONNECT WALLET' : 'BALANCE'}</p>
                        {address != '' && <p className="dashboard__num"><span className='dashboard__symbol'>ꜩ</span>{balance.toFixed(3)}</p>}
                    </div>
                </div>
            </header>
            
            <main className='container container--small'>

                <div className="listBlock listBlock--wide">
                    <ul className="listBlock__list">
                      {
                        leaderboard.map((player, index) => (
                          <li key={'player-' + index} className={`listBlock__item ${address === player.name ? 'listBlock__item--active' : ''}`}>
                            <p className="listBlock__rank">{index + 1}</p>
                            <p className="listBlock__nft">{player.address}</p> 
                            <p className="listBlock__score">{player.amount}</p>
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