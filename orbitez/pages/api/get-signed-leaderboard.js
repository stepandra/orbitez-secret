// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { CONTRACT_ADDRESS } from '../../constants'
const WebSocket = require('ws');
const SEND_254 = new Uint8Array([254, 6, 0, 0, 0]);
const SEND_255 = new Uint8Array([255, 1, 0, 0, 0]);

class Reader {
  constructor(view, offset, littleEndian) {
      this.reader = true;
      this._e = littleEndian;
      if (view) this.repurpose(view, offset);
  }
  repurpose(view, offset) {
      this.view = view;
      this._o = offset || 0;
  }
  getUint8() {
      return this.view.getUint8(this._o++, this._e);
  }
  getInt8() {
      return this.view.getInt8(this._o++, this._e);
  }
  getUint16() {
      return this.view.getUint16((this._o += 2) - 2, this._e);
  }
  getInt16() {
      return this.view.getInt16((this._o += 2) - 2, this._e);
  }
  getUint32() {
      return this.view.getUint32((this._o += 4) - 4, this._e);
  }
  getInt32() {
      return this.view.getInt32((this._o += 4) - 4, this._e);
  }
  getFloat32() {
      return this.view.getFloat32((this._o += 4) - 4, this._e);
  }
  getFloat64() {
      return this.view.getFloat64((this._o += 8) - 8, this._e);
  }
  getStringUTF8() {
      let s = '', b;
      while ((b = this.view.getUint8(this._o++)) !== 0) s += String.fromCharCode(b);
      return decodeURIComponent(escape(s));
  }
}

export default async function handler(req, res) {
  const { server } = req.body
  var oracle = new InMemorySigner(process.env.SIGNING_PRIVATE_KEY);
  const Tezos = new TezosToolkit("https://ithacanet.ecadinfra.com");
  let contractServerList = []

  const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
  const storage = await contract.storage()

  for (let [key, value] of storage.server.valueMap) {
      contractServerList.push({...value, name: key})
  }
  const selectedServers = contractServerList.filter(el => el.name == server)
  const WEBSOCKET_URL = selectedServers[0].server_url;

  // Collect leaderboard data
  let ws = null
  const stats = {
    info: {}
  };

  async function wsInit() {
    if (ws) {
        Logger.debug('WebSocket init on existing connection');
        wsCleanup();
    }
    ws = new WebSocket(`wss://${WEBSOCKET_URL}`);
    ws.binaryType = 'arraybuffer';
    ws.onopen = wsOpen;
    ws.onerror = wsError;
    ws.onclose = wsClose;

    return new Promise(resolve => {
      ws.on('message', (msg) => { wsMessage(msg, resolve);  })
    })
  }

  function wsCleanup() {
    if (!ws) return;
    Logger.debug('WebSocket cleanup');
    ws.onopen = null;
    ws.onmessage = null;
    ws.close();
    ws = null;
  }

  function wsOpen() {
    wsSend(SEND_254)
    wsSend(SEND_255)
    wsSend(new Uint8Array([254]))
  }

  function wsError(error) {
      console.log(error);
  }

  function wsClose(e) {
      if (e.currentTarget !== ws) return;
      console.log(`WebSocket disconnected ${e.code} (${e.reason})`);
      wsCleanup();
  }

  function wsSend(data) {
      if (!ws) return;
      console.log(ws.readyState)
      if (ws.readyState !== 1) return;
      ws.send(data);
  }

  function wsMessage(data, resolve) {
    const reader = new Reader(new DataView(data), 0, true);
    const packetId = reader.getUint8();
    switch (packetId) {
      case 0xFE: { // server stat
        stats.info = JSON.parse(reader.getStringUTF8());
        resolve()
        break;
      }
      default: { 

      }
    }
  }

  // WEBSOCKET
  await wsInit()
  console.log(stats.info.leaderboard)
  const newMapfromLiteral = []
   
  for (let record of stats.info.leaderboard) {
    if (record.name == '') continue
    let [, skin, address] = /^(?:\<([^}]*)\>)?([^]*)/.exec(record.name || '')
    newMapfromLiteral.push({
      address, amount: Math.round(record.score)
    })
  }

  const listToMichelson = (list) => {
    return list.map((el) => ({
      prim: "Pair",
      args: [
        { string: el.address },
        { int: el.amount+'' },
      ]
    }))
  }

  Tezos.rpc.packData({
    data: listToMichelson(newMapfromLiteral),
    type: {
      prim: "list",
      args: [
        { 
          prim: "pair", 
          args: [{ prim: "string" }, { prim: "nat" }] 
        },
      ]
    }
  }).then(wrappedPacked => {
    const hexScore = wrappedPacked.packed;
    oracle.sign(hexScore).then(s => {
      res.send({
        sig: s.sig,
        value: s.prefixSig,
        packed: wrappedPacked.packed,
        signed: s.bytes,
        leaderboard: newMapfromLiteral
      })
    });
  })
}
