import * as errors from './infra/errors';
import {hexToString} from './infra/hex_encoding';
import {sleep} from './infra/sleep';
import {ValueStream} from './infra/value_stream';
import {Region} from './model/digitalocean';

import {OrbitezServer} from './orbitez_server';
 
// Prefix used in key-value tags.
const KEY_VALUE_TAG = 'kv';
// The tag that appears at the beginning of installation.
const INSTALL_STARTED_TAG = 'install-started';
// The tag key for the manager API certificate fingerprint.
const NGROK_READY = 'ngrok_ready';
// The tag which appears if there is an error during installation.
const INSTALL_ERROR_TAG = 'install-error';


function getCompletionFraction(state) {
  switch (state) {
    case 'UNKNOWN':
      return 0.1;
    case 'DROPLET_CREATED':
      return 0.5;
    case 'DROPLET_RUNNING':
      return 0.75;
    case 'COMPLETED':
      return 1.0;
    default:
      return 0;
  }
}

function isFinal(state) {
  return (
    state === 'COMPLETED' ||
    state === 'FAILED' ||
    state === 'CANCELED'
  );
}

export class DigitalOceanServer extends OrbitezServer {
  onDropletActive;
  onceDropletActive = new Promise((fulfill) => {
    this.onDropletActive = fulfill;
  });
  installState = new ValueStream('UNKNOWN');
  startTimestamp = Date.now();

  constructor(
    id,
    digitalOcean,
    dropletInfo
  ) {
    super(id);
    this.digitalOcean = digitalOcean
    this.dropletInfo = dropletInfo
    // Consider passing a RestEndpoint object to the parent constructor,
    // to better encapsulate the management api address logic.
    
    console.info('DigitalOceanServer created');
    // Go to the correct initial state based on the initial dropletInfo.
    this.updateInstallState();
    // Start polling for state updates.
    this.pollInstallState();
  }

  updateInstallState() {
    const TIMEOUT_MS = 15 * 60 * 1000;

    const tagMap = this.getTagMap();
    if (tagMap.get(INSTALL_ERROR_TAG)) {
      console.error(`error tag: ${tagMap.get(INSTALL_ERROR_TAG)}`);
      this.setInstallState('FAILED');
    } else if (Date.now() - this.startTimestamp >= TIMEOUT_MS) {
      console.error('hit timeout while waiting for installation');
      this.setInstallState('FAILED');
    } else if (tagMap.get(INSTALL_STARTED_TAG)) {
      this.setInstallState('DROPLET_RUNNING');
    } else if (this.dropletInfo?.status === 'active') {
      this.setInstallState('DROPLET_CREATED');
    }
  }

 
  async pollInstallState() {
    while (!this.installState.isClosed()) {
      try {
        await this.refreshDropletInfo();
      } catch (error) {
        console.log('Failed to get droplet info', error);
        this.setInstallState('FAILED');
        return;
      }
      this.updateInstallState();
      // Return immediately if installation is terminated
      // to prevent race conditions and avoid unnecessary delay.
      if (this.installState.isClosed()) {
        return;
      }
      // TODO: If there is an error refreshing the droplet, we should just
      // try again, as there may be an intermittent network issue.
      await sleep(3000);
    }
  }

  setInstallState(installState) {
    this.installState.set(installState);
    if (isFinal(installState)) {
      this.installState.close();
    }
  }

  // Refreshes the state from DigitalOcean API.
  async refreshDropletInfo() {
    const newDropletInfo = await this.digitalOcean.getDroplet(this.dropletInfo.id);
    const oldDropletInfo = this.dropletInfo;
    this.dropletInfo = newDropletInfo;
    if (newDropletInfo.status !== oldDropletInfo.status) {
      if (newDropletInfo.status === 'active') {
        this.onDropletActive();
      }
    }
  }

  // Gets the key-value map stored in the DigitalOcean tags.
  getTagMap() {
    const ret = new Map();
    const tagPrefix = KEY_VALUE_TAG + ':';
    console.log(this.dropletInfo.tags)
    for (const tag of this.dropletInfo.tags) {
      if (!startsWithCaseInsensitive(tag, tagPrefix)) {
        continue;
      }
      const keyValuePair = tag.slice(tagPrefix.length);
      const [key, hexValue] = keyValuePair.split(':', 2);
      try {
        ret.set(key.toLowerCase(), hexValue);
      } catch (e) {
        console.error('error decoding hex string');
      }
    }
    return ret;
  }

  // Returns the public ipv4 address of this server.
  ipv4Address() {
    for (const network of this.dropletInfo.networks.v4) {
      if (network.type === 'public') {
        return network.ip_address;
      }
    }
    return undefined;
  }

  getHost() {
    return new DigitalOceanHost(this.digitalOcean, this.dropletInfo, this.onDelete.bind(this));
  }

  onDelete() {
    if (!this.installState.isClosed()) {
      this.setInstallState('CANCELED');
    }
  }
}

class DigitalOceanHost {
  constructor(
    digitalOcean,
    dropletInfo,
    deleteCallback
  ) {
    this.digitalOcean = digitalOcean
    this.dropletInfo = dropletInfo
    this.deleteCallback = deleteCallback
  }

  getMonthlyOutboundTransferLimit() {
    // Details on the bandwidth limits can be found at
    // https://www.digitalocean.com/community/tutorials/digitalocean-bandwidth-billing-faq
    return {terabytes: this.dropletInfo.size.transfer};
  }

  getMonthlyCost() {
    return {usd: this.dropletInfo.size.price_monthly};
  }

  getCloudLocation() {
    return new Region(this.dropletInfo.region.slug);
  }

  delete() {
    this.deleteCallback();
    return this.digitalOcean.deleteDroplet(this.dropletInfo.id);
  }
}

function startsWithCaseInsensitive(text, prefix) {
  return text.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase();
}
