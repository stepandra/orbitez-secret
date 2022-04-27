// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';


export default function handler(req, res) {
  var oracle = new InMemorySigner(process.env.SIGNING_PRIVATE_KEY);
  const Tezos = new TezosToolkit("https://ithacanet.ecadinfra.com");

  // TODO unhardcode this
  const newMapfromLiteral = [
    { address: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN', amount: 333 },
    { address: 'tz1RgYYwvFK7t3XNgTviu3bwv3oVtAXwDUdK', amount: 533 },
  ];

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
        signed: s.bytes
      })
    });
  })
}
