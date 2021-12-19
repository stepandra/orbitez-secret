import React from 'react';
import Head from 'next/head'

export default function Leaderboard() {
    
    return (
        <body className="background">
            <Head>
                <meta charset="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Leaderboard - Orbitez.io</title>
            </Head>
            <header className="header">
                <h1 className="header__title">Leaderboard</h1>
            </header>
            
            <main className='page container container--small'>

                <div className="listBlock listBlock--wide">
                    <ul className="listBlock__list">
                        <li className="listBlock__item">
                            <p className="listBlock__rank">1</p>
                            <p className="listBlock__nft">NFT #456677 </p> 
                            <span className="listBlock__score">45667374647</span>
                        </li>
                        <li className="listBlock__item listBlock__item--active">
                            <p className="listBlock__rank">2</p>
                            <p className="listBlock__nft">NFT #686890090876</p>  
                            <p className="listBlock__score">6868937</p>
                            <a className="listBlock__link" href=""></a>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">3</p>
                            <p className="listBlock__nft">NFT #678978787 </p> 
                            <span className="listBlock__score">45667374647</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">4</p>
                            <p className="listBlock__nft">NFT #87879 </p> 
                            <span className="listBlock__score">45667374647</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">5</p>
                            <p className="listBlock__nft">NFT #878665 </p> 
                            <span className="listBlock__score">45667374647</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">6</p>
                            <p className="listBlock__nft">NFT #456677 </p> 
                            <span className="listBlock__score">4566737464</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">7</p>
                            <p className="listBlock__nft">NFT #456677 </p> 
                            <span className="listBlock__score">4566737464</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">8</p>
                            <p className="listBlock__nft">NFT #456677 </p> 
                            <span className="listBlock__score">456673746</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">9</p>
                            <p className="listBlock__nft">NFT #456677 </p> 
                            <span className="listBlock__score">37117374</span>
                        </li>
                        <li className="listBlock__item">
                            <p className="listBlock__rank">10</p>
                            <p className="listBlock__nft">NFT #456677 </p> 
                            <span className="listBlock__score">3566737</span>
                        </li>
                    </ul>
                </div>

            </main>
        </body>
    )
}