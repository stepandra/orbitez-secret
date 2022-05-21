import { TezosToolkit } from "@taquito/taquito"
import { NetworkType } from "@airgap/beacon-sdk"
import { useState, useEffect, useContext } from 'react'
import { NFT_ADDRESS } from '../constants'
import { useAppContext } from '../pages/_app'
import { MichelCodecPacker } from '@taquito/taquito';
import { InMemorySigner } from "@taquito/signer"

export class LambdaViewSigner {
  async publicKeyHash() {
    return "tz1fVQangAfb9J1hRRMP2bSB6LvASD6KpY8A";
  }

  async publicKey() {
    return "edpkvWbk81uh1DEvdWKR4g1bjyTGhdu1mDvznPUFE2zDwNsLXrEb9K";
  }

  async secretKey() {
    throw new Error("Secret key cannot be exposed");
  }

  async sign() {
    throw new Error("Cannot sign");
  }
}

export function useTezos() {
  const wallet = useAppContext()
  const RPC_URL = 'https://ithacanet.smartpy.io';
  const Tezos = new TezosToolkit(RPC_URL)
  Tezos.setPackerProvider(new MichelCodecPacker())
  InMemorySigner.fromSecretKey('edskRzktjkrznmjWoVr5tKThrX41MM7n3fP6cVLwt6Tw65EUykyEGkaMVcTSGe9DsppM8KH6hiwAcyzQFqkEbXwEV4PgaL1dDB').then(signer => Tezos.setSignerProvider(signer))

  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')

  useEffect(async () => {
    connectionExistsCheck()
    updateBalance()
  }, [address])

  const connectionExistsCheck = async () => {
    if (!wallet) return false
    const activeAccount = await wallet.client.getActiveAccount()
    if (activeAccount) {
      console.log(`Already connected: ${activeAccount.address}`)
      setAddress(activeAccount.address)
      localStorage.setItem('tzAddress', address)
      return true
    }
    return false
  }

  const updateBalance = async () => {
    if (address == '') return
    const bal = await Tezos.rpc.getBalance(address)
    setBalance(bal.toNumber() / 1000000)
  }

  const connectWallet = async () => {
    const connectionExists = await connectionExistsCheck()
    if (!connectionExists) {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.ITHACANET,
          // type: NetworkType.MAINNET,
          rpcUrl: RPC_URL,
        },
      })
      const addr = await wallet.getPKH()
      setAddress(addr)
      localStorage.setItem('tzAddress', address)
    } else {
      const nft = await Tezos.contract.at(NFT_ADDRESS)
      // console.log(nft.methods.balance_of([{owner: address, token_id: 1}], 'KT1NXgqXUfYFowmoZK6FhUTxmcqkjzZnV5rg').send())
      // console.log("New connection: ", address)
      alert(`Already connected`)
    }
  }

  const disconnectWallet = async () => {
    await wallet.clearActiveAccount()
    setAddress('')
    localStorage.removeItem('tzAddress')
    alert('Disconnected.')
  }

  return {
    connectWallet,
    disconnectWallet,
    wallet,
    Tezos,
    address,
    balance,
  }
}

