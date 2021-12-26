import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from '../constants';
import axios from 'axios';
const signalR = require("@microsoft/signalr");

export default function Hud() {
    const [endBlock, setEndBlock] = useState(null)
    const [currentBlock, setCurrentBlock] = useState(0)
    const [waitDone, setWaitDone] = useState(false)
    const router = useRouter()

    const isGameLive = !endBlock || currentBlock <= Number(endBlock)

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.hangzhou2net.tzkt.io/v1/events") //https://api.tzkt.io/ MAINNEt
            .build();

        axios.get(`https://api.hangzhou2net.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/storage`).then(res => {
            setEndBlock(res.data.end_block)
            console.log(endBlock)
        })

        async function init() {
            // open connection
            await connection.start();
            // subscribe to head
            await connection.invoke("SubscribeToBlocks");

            setWaitDone(true)
        };

        // auto-reconnect
        connection.onclose(init);

        connection.on("blocks", (msg) => {
            setCurrentBlock(msg.state)
            // console.log(msg.state)
            if (!isGameLive) {
                router.push('/last-game-stats')
            }
        });

        init();
    }, [])

    function createMarkup () {
        return {
            __html: `
        <div>
            <link id="favicon" rel="icon" type="image/png" href="/img/favicon.png">
            <link href="https://fonts.googleapis.com/css?family=Ubuntu:700" rel="stylesheet" type="text/css">
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">

            <script src="/assets/js/quadtree.js"></script>
            <script src="/assets/js/main_out.js"></script>
            <div id="gallery" onclick="if (event.target == this) this.hide()" style="display: none;">
                <div id="gallery-content">
                    <div id="gallery-header">Skins</div>
                    <div id="gallery-body"></div>
                </div>
            </div>
            <div id="overlays" style="display: none;">
                <div id="helloDialog">
                    <div className="form-group">
                        <h2 id="title">ORBITEZ.IO</h2>
                    </div>

                    <div className="form-group">
                        <input id="nick" disabled className="form-control" placeholder="Nickname" maxlength="15">
                        <input id="skin" className="form-control" placeholder="Skin Name">
                        <select style="display:none" id="gamemode" className="form-control" onchange="setserver(this.value)" required>
                           
                            <option value="ws.orbitez.io" selected>ws.orbitez.io</option>
                        </select>
                    </div>

                    <button id="play-btn" className="btn btn-play btn-primary btn-needs-server">Play</button>
                    
                    <button id="gallery-btn" onclick="openSkinsList()"
                        className="btn btn-play btn-primary btn-needs-server btn-info">Skins Gallery</button>

                    <div id="settings">
                    </div>

                    <div id="instructions">
                        <hr>
                        <center>
                            <span className="text-muted">
                                Move your mouse to control your cell<br>
                                Press <b>Space</b> to split<br>
                                Press <b>W</b> to eject some mass<br>
                            </span>
                        </center>
                    </div>

                    <hr>
                    <div id="footer">
                        <span className="text-muted">Have fun!</span>
                    </div>

                </div>
            </div>

            <div id="connecting">
                <div id="connecting-content">
                    <h2>Connecting</h2>
                    <p> If you cannot connect to the servers, check if you have some anti virus or firewall blocking the
                        connection.</p>
                </div>
            </div>

            <div id="mobileStuff" style="display: none;">
                <div id="touchpad"></div>
                <div id="touchCircle" style="display: none;"></div>
                <img src="/img/split.png" id="splitBtn">
                <img src="/img/eject.png" id="ejectBtn">
            </div>

            <canvas id="canvas" width="800" height="600"></canvas>
            <input type="text" id="chat_textbox" placeholder="Press enter to chat" maxlength="200">
            <div style="font-family:'Ubuntu'">&nbsp;</div>
        </div>
        `};
    }

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

            <div dangerouslySetInnerHTML={isGameLive && waitDone ? createMarkup() : null} ></div>

            <main className='page container container--big'>

            </main>
        </div>
    )
}
