
import { DigitalOceanAccount } from '../../digitalocean/digitalocean_account' 
import { Region } from '../../digitalocean/model/digitalocean';

const TOKEN = 'dop_v1_566c783344683aa6eea4135bb4e5660e369199e78294b549bfaa298882ede47b'
const REGION = 'nyc3'

export default function handler(req, res) {
  const doAccount = new DigitalOceanAccount('do_account', TOKEN, true)
  doAccount.createServer(new Region(REGION), 'ORBITEZ_TEZ_NODE');

  res.send({ku: '200'})
}
