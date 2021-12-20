import React from 'react';
import Head from 'next/head'
import Link from 'next/link';

export default function Hud() {
    
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
                        <h2 className="listBlock__title blockTitle">Waiting for players 6/10</h2>
                        <ul className="listBlock__list">
                            <li className="listBlock__item">NFT #456677</li>
                            <li className="listBlock__item listBlock__item--active">NFT #686890090876</li>
                            <li className="listBlock__item">NFT #678978787</li>
                            <li className="listBlock__item">NFT #87879</li>
                            <li className="listBlock__item">NFT #878665</li>
                            <li className="listBlock__item">NFT #86656645454</li>
                        </ul>
                    </div>
                </div>

                <div className="page__center">
                    <div className="planet">
                        <img className="planet__img" src="/img/planet.png" alt="planet background" />
                        <Link className="planet__btn btn btn--center" href="/hud">START</Link>
                        <Link className="btn btn--center" href="/dashboard">CANCEL</Link>
                    </div>
                </div>

                <div className="page__right">
                    
                </div>
            </main>
        </body>
    )
}