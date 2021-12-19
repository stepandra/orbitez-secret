import React from 'react';
import Head from 'next/head'
import { useTezos } from '../hooks/useTezos';

export default function hud() {
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
                    <div class="form-group">
                        <h2 id="title">Cigar2</h2>
                    </div>

                    <div class="form-group">
                        <input id="nick" class="form-control" placeholder="Nickname" maxlength="15">
                        <input id="skin" class="form-control" placeholder="Skin Name">
                        <select id="gamemode" class="form-control" onchange="setserver(this.value)" required>
                           
                            <option value="localhost:8080" selected>orbi.tez 8080</option>
                        </select>
                    </div>

                    <button id="play-btn" class="btn btn-play btn-primary btn-needs-server">Play</button>
                    <button id="spectate-btn" onclick="spectate()"
                        class="btn btn-warning btn-spectate btn-needs-server glyphicon glyphicon-eye-open"></button>
                    <button id="gallery-btn" onclick="openSkinsList()"
                        class="btn btn-play btn-primary btn-needs-server btn-info">Skins Gallery</button>

                    <div id="settings">
                    </div>

                    <div id="instructions">
                        <hr>
                        <center>
                            <span class="text-muted">
                                Move your mouse to control your cell<br>
                                Press <b>Space</b> to split<br>
                                Press <b>W</b> to eject some mass<br>
                            </span>
                        </center>
                    </div>

                    <hr>
                    <div id="footer">
                        <span class="text-muted">Have fun!</span>
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
        <div class="bgImageNone">
            <Head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Hud - Orbitez.io</title>
                <link href='style.css' rel="stylesheet" />
            </Head>

            <header class="header">
                <div class="blocksTimer">
                    
                </div>
                
                <div class="panel">
                    <div class="panel__icon">
                        <a class="panel__link" href="">
                            <img class="panel__img" src="/img/icon-home.png" alt="Home icon" />
                        </a>
                    </div>
                    <div class="panel__info">
                        <p class="panel__text">SCORE</p>
                        <p class="panel__num">35000</p>
                    </div>
                </div>
            </header>

            <div dangerouslySetInnerHTML={ createMarkup() } ></div>
            
            <main class='page container container--big'>
                
            </main>
        </div>
    )
}
