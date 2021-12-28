export const InnerHtml = {
  __html: `
  <div>

  <script id="fxhash-snippet">
  //---- do not edit the following code (you can indent as you wish)
  let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  var fxhash = localStorage.getItem("fxHash")
  // "oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet.length) | 0]).join('')
  let b58dec = (str) => str.split('').reduce((p, c, i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length - i - 1)), 0)
  let fxhashTrunc = fxhash.slice(2)
  let regex = new RegExp(".{" + ((fxhash.length / 4) | 0) + "}", 'g')
  let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
  let sfc32 = (a, b, c, d) => {
      return () => {
      a |= 0; b |= 0; c |= 0; d |= 0
      var t = (a + b | 0) + d | 0
      d = d + 1 | 0
      a = b ^ b >>> 9
      b = c + (c << 3) | 0
      c = c << 21 | c >>> 11
      c = c + t | 0
      return (t >>> 0) / 4294967296
    }
  }
  var fxrand = sfc32(...hashes)
  //---- /do not edit the following code 
  function getGravity(value) {
    if (value < 0.1) return "extra low"
    else if (value < 0.5) return "low"
    else if (value < 0.9) return "high"
    else if (value < 0.05) return "extra high"
    else if (value < 0.02) return "giant"
    else return "medium"
  }
  
  function isExoplanet(value) {
    if (value < 0.05) return "Twin Earth"
    else if (value < 0.9) return "No"
    else return "Yes"
  }
  function getSize(value) {
    if (value < 0.1) return "Sub-brown dwarf"
    else if (value < 0.8) return "Satellite"
    else if (value < 0.5) return "Dwarf"
    else if (value < 0.05) return "Former star"
    else if (value < 0.02) return "Rogue"
    else return "Asteroid"
  }
  function getHab(value) {
    return Math.round(value * 100)
  }
</script>
<canvas id="c" width="800" height="800"></canvas>
  <div style="display:none" id="stats"></div>
  <div style="display:none" id="txt">
  <script src="/jquery-3.2.0.min.js"></script>
  <script src="/seedrandom.js"></script>

  </div>
  
  <div style="display:none" id="DownloadDiv" style="width: 100% !important; position: absolute;">
  
  
  <a download="planet.txt" id="downloadText" class="button"><img src="/download-text.png"><div class="tooltip">Download Text</div></a>
  <a download="Planet.png" id="download" onmouseover="writeImageData();" class="button"><img src="/download-image.png"><div class="tooltip">Download Image</div></a>
  <a id="mapSwitch" class="button" onclick="doMapSwitch();"><img src="/map.png"><div class="tooltip">Switch to Map</div></a>
  <a id="setID" class="button" onclick="setID();"><img src="/id.png"><div class="tooltip">View/Set ID</div></a>
  <a id="nextPlanet" class="button" onclick="genFromRandomID();"><img src="/next.png"><div class="tooltip">Random New Planet</div></a>
  
  
      </br>
  </div>
  
  <style>
  .button {
    top: 1em;
    position:relative;
    cursor: pointer;
    text-decoration: none !important;
    color: white;
  }
  
  .button img {
    width: 40px;
  }
  
  .button .tooltip {
    position: absolute;
    display: none;
    top: 40px;
    left: 0px;
    width: 300px;
    text-align: left;
  }
  
  .button:hover .tooltip {
    display: block;
  }
  
  #download, #mapSwitch, #setID, #nextPlanet {
    margin-left: 1em;
  }
  
  #DownloadDiv{
    text-align:center;
  }
  
  
  
  </style>
  <script defer="defer" src="/bundle.js"></script>
  </div>
  `
}