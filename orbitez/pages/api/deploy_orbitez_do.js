
import { DigitalOceanAccount } from '../../digitalocean/digitalocean_account' 
import { Region } from '../../digitalocean/model/digitalocean';

const REGION = 'nyc3'

export default function handler(req, res) {
  const { token, deployTezos } = req.body
  const doAccount = new DigitalOceanAccount('do_account', token, true)

  doAccount.createServer(new Region(REGION), 'ORBITEZ_TEZ_NODE', deployTezos);

  res.send({ku: '200'})
}
