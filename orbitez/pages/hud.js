import React from 'react';
import Head from 'next/head'
import { useTezos } from '../hooks/useTezos';

export default function Hud() {
    const { connectWallet, address, Tezos, balance } = useTezos()
    
    // const router = useRouter()
    function createMarkup() {
        return {__html: `
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
                        <h2 id="title">Cigar2</h2>
                    </div>

                    <div className="form-group">
                        <input id="nick" className="form-control" placeholder="Nickname" maxlength="15">
                        <input id="skin" className="form-control" placeholder="Skin Name">
                        <select id="gamemode" className="form-control" onchange="setserver(this.value)" required>
                           
                            <option value="ws.orbitez.io" selected>ws.orbitez.io</option>
                        </select>
                    </div>

                    <button id="play-btn" className="btn btn-play btn-primary btn-needs-server">Play</button>
                    <button id="spectate-btn" onclick="spectate()"
                        className="btn btn-warning btn-spectate btn-needs-server glyphicon glyphicon-eye-open"></button>
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
                <meta charset="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Hud - Orbitez.io</title>
                <link href='style.css' rel="stylesheet" />
            </Head>

            <header className="header">
                <div className="blocksTimer">
                    
                </div>
                
                <div className="panel">
                    <div className="panel__icon">
                        <a className="panel__link" href="">
                            <img className="panel__img" src="/img/icon-home.png" alt="Home icon" />
                        </a>
                    </div>
                    <div className="panel__info">
                        <p className="panel__text">SCORE</p>
                        <p className="panel__num">35000</p>
                    </div>
                </div>
            </header>

            <div dangerouslySetInnerHTML={ createMarkup() } ></div>
            
            <main className='page container container--big'>
                
            </main>
        </div>
    )
}
