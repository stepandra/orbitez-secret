
import { DigitalOceanAccount } from '../../digitalocean/digitalocean_account' 
import { Region } from '../../digitalocean/model/digitalocean';

export default function handler(req, res) {
  const { token, deployTezos, region } = req.body
  const doAccount = new DigitalOceanAccount('do_account', token, true)
  doAccount.createServer(new Region(region), 'ORBITEZ_TEZ_NODE', deployTezos);

  res.send({ success: true })
}
