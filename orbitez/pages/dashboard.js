import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTezos } from '../hooks/useTezos'
import { CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from '../constants'
import Link from 'next/link';
import { useNFT} from '../hooks/useNFT.ts';
import PlanetGenerator from '../components/PlanetGenerator/PlanetGenerator';

export default function Dashboard() {
    const { connectWallet, disconnectWallet, address, Tezos, balance } = useTezos()
    const router = useRouter()
    const img_url = "";
    const [imgLink, setImgLink] = useState(null);
    const fxhash_tokenid = [];
    const [mintHash, setMintHash] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [planetsAvailable, setPlanetsAvailable] = useState([])
    const [planetSelected, setPlanetSelected] = useState(null)
   
   
    fetch("https://api.fxhash.xyz/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ query: '{generativeToken(slug: "Orbitoid", id: 3808) {entireCollection {id owner {id} generationHash metadata }}}' })
      })
        .then(res => res.json())
        .then(res => {
            console.log(res.data?.generativeToken);
            const owners_ids = res.data?.generativeToken?.entireCollection;
            console.log(owners_ids);
            owners_ids.find(function(post, index) {
                if(post.owner.id == address) {
                    fxhash_tokenid.push(post.id);
                    console.log(fxhash_tokenid);
                    // parse artifactUri to animate
                    const ipfs_url = post.metadata.displayUri;
                    const gen_hash = post.metadata.iterationHash;
                    console.log('Gen ID: ' + post.id);
                    setMintHash('' + gen_hash);
                    setImgLink('https://cloudflare-ipfs.com/ipfs' + ipfs_url.slice(6));
                    setTokenId('' + post.id);
                    return true;
                }
            });
        });


    // const { data, loading } = useNFT('KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE', fxhash_tokenid);

    useEffect(() => {
        (tokenId) ? setPlanetsAvailable([...planetsAvailable, tokenId]) : setPlanetsAvailable([])
        localStorage.setItem('skinLink', imgLink)
    }, [imgLink, tokenId])

  

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

    const mintOnFx = async () => {
        const contract = await Tezos.wallet.at(NFT_CONTRACT_ADDRESS);
        try {
            await contract.methods.mint("tz1iJJPGh7arygfq5EC2sBaAF23T8iUYTpEH", 3808).send({ amount: 1 })

            // router.push('/waiting-room')
        } catch (e) {
            console.log('Transaction rejected:', e)
        }
    }

    return (
        <div className="background">
            <Head>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Dashboard - Orbitez.io</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <header className="header container">
                <Link href="/leaderboard">
                    <a className="header__linkLeft link">LEADERBOARD</a>
                </Link>
                <h1 className="header__title">Dashboard</h1>
                <div className="header__dashboard dashboard">
                    <div className="dashboard__icon">
                        <a className="dashboard__link" onClick={() => disconnectWallet()}>
                            <img className="dashboard__img" src="/img/icon-exite.png" alt="Home icon" />
                        </a>
                    </div>
                    <div className="dashboard__info">
                        <p onClick={() => connectWallet()} className="dashboard__text">{address == '' ? 'CONNECT WALLET' : 'BALANCE'}</p>
                        {address != '' && <p className="dashboard__num"><span className='dashboard__symbol'>ꜩ</span>{balance.toFixed(3)}</p>}
                    </div>
                </div>
            </header>
            
            <main className='page container'>
                <div className="page__left">
                    <div className="listBlock">
                        <h2 className="listBlock__title">Select Planet</h2>
                        {
                            planetsAvailable.length > 0 && 
                            <ul className="listBlock__list">
                                {
                                planetsAvailable.map(planet => 
                                    <li 
                                        key={'planet' + planet}
                                        onClick={() => setPlanetSelected(planet)} 
                                        className={`listBlock__item ${planet === planetSelected ? 'listBlock__item--active' : ''}`}
                                        >
                                        { planet }
                                    </li> 
                                    )
                                }
                            </ul>
                        }
                        {
                            !planetsAvailable.length && <p className="listBlock__text">{`Uh oh, Looks like you haven't minted any planet NFTs...`}</p>
                        }
                    </div>
                    { address !== '' && <a className="btn btn--wide" onClick={() => mintOnFx()}>MINT NEW NFT</a>}

                    <div className="payMethod">
                        <h3 className="payMethod__title">Payment method</h3>
                        <div className="payMethod__switcher">
                            <img className="payMethod__prev" src='/img/icon-prev.png'></img>
                            <p className="payMethod__item">LP Token</p>
                            <img className="payMethod__next" src='/img/icon-prev.png'></img>
                        </div>
                    </div>
                </div>

                <div className="page__center">
                    <div className="planet planet--bgCircle">
                        <PlanetGenerator mint_hash={mintHash} />
                        {/* {imgLink !== '' && <img className="planet__img " src={imgLink} alt="planet background" />} */}
                        <a onClick={() => { 
                            address == '' ? connectWallet() : enterRoom() 
                        }} className="planet__btn btn btn--center btn--neon" >
                            {
                                address == ''
                                ? 'Connect wallet'
                                : ( !planetsAvailable.length ) 
                                    ? 'Mint new NFT'
                                    : 'PLAY 1 XTZ'
                            }
                        </a>
                    </div>
                </div>

                <div className="page__right">
                    <div className="listBlock">
                        <h2 className="listBlock__title">Statistics</h2>
                        <ul className="listBlock__list">
                            <li className="listBlock__item">Matter eaten <span>12345</span></li>
                            <li className="listBlock__item">Highest mass <span>12345</span></li>
                            <li className="listBlock__item">Time alive <span>12:45</span></li>
                            <li className="listBlock__item">On leaderboard <span>0:43</span></li>
                            <li className="listBlock__item">Planets eaten <span>134</span></li>
                            <li className="listBlock__item">Top position <span>134</span></li>
                        </ul>
                    </div>
                    {/* <a className="btn btn--wide" href="/waiting-room">PLAY 1 XTZ</a>
                    <a className="btn btn--wide btn--second" href="/waiting-room">PLAY 10 XTZ</a> */}
                </div>
            </main>
        </div>
    )
}

