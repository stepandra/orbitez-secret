
import { DigitalOceanAccount } from '../../digitalocean/digitalocean_account' 
import { Region } from '../../digitalocean/model/digitalocean';

const TOKEN = ''
const REGION = 'lon1'

export default function handler(req, res) {
  const doAccount = new DigitalOceanAccount('do_account', TOKEN, true)
  doAccount.createServer(new Region(REGION), 'ORBITEZ_TEZ_NODE');

  res.send({ku: '200'})
}
