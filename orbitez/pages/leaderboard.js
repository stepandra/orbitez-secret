import React    from 'react';
import Head     from 'next/head'
import Image    from 'next/image';

import Header   from '../components/Header/Header';
import Planet   from '../components/Planet/Planet';
import PlanetDataList from '../components/PlanetDataList/PlanetDataList';


export default function Leaderboard() {

    return (
        <>
            <Head>
                <title>Leaderboard - Orbitez.io</title>
            </Head>

            <Header/>
            
            <main className='leaderBoard container'>
                <div className="leaderBoard__inner">

                    <div className="leaderBoard__bg">
                        <Image src='/img/bg-leaderboard.png' layout='fill' />
                    </div>
                    <p className="leaderBoard__planetName"><span>NAME:</span> NFT#987654134526</p>
                    <a className="leaderBoard__share">Share</a>
                    
                    <div className="statList">
                        <h2 className="statList__title">LEADERBOARD:</h2>
                        <ul className="statList__list">
                            <li className="statList__item">
                                <p className="statList__rank">1.</p>
                                <p className="statList__nft">NFT #456677 </p> 
                                <p className="statList__score">112 pts</p>
                                <p className="statList__price">200 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">2.</p>
                                <p className="statList__nft">NFT #686890090876</p>  
                                <p className="statList__score">498 pts</p>
                                <p className="statList__price">9.002 TEZ</p>
                            </li>
                            <li className="statList__item statList__item--active">
                                <p className="statList__rank">3.</p>
                                <p className="statList__nft">NFT #897564320020</p> 
                                <p className="statList__score">477 pts</p>
                                <p className="statList__price">7.002 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">4.</p>
                                <p className="statList__nft">NFT #87879 </p> 
                                <p className="statList__score">500 pts</p>
                                <p className="statList__price">10.552 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">5.</p>
                                <p className="statList__nft">NFT #878665 </p> 
                                <p className="statList__score">477 pts</p>
                                <p className="statList__price">11.002 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">6.</p>
                                <p className="statList__nft">NFT #456677 </p> 
                                <p className="statList__score">500 pts</p>
                                <p className="statList__price">10.882 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">7.</p>
                                <p className="statList__nft">NFT #8975 </p> 
                                <p className="statList__score">477 pts</p>
                                <p className="statList__price">8.002 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">8.</p>
                                <p className="statList__nft">NFT #456677 </p> 
                                <p className="statList__score">400 pts</p>
                                <p className="statList__price">9.05 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">9.</p>
                                <p className="statList__nft">NFT #456677 </p> 
                                <p className="statList__score">477 pts</p>
                                <p className="statList__price">9 TEZ</p>
                            </li>
                            <li className="statList__item">
                                <p className="statList__rank">10.</p>
                                <p className="statList__nft">NFT #456677 </p> 
                                <p className="statList__score">477 pts</p>
                                <p className="statList__price">0.45 TEZ</p>
                            </li>
                        </ul>
                    </div>

                    <Planet className='planet--bgCircle'>
                        <a className="btn btn--center" href="">BUY</a>
                    </Planet>

                    <PlanetDataList className='planetData--clear'/>
                
                </div>
            </main>
        </>
    )
}