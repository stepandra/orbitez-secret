import { TezosToolkit } from "@taquito/taquito"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { NetworkType } from "@airgap/beacon-sdk"
import { useState, useEffect, memo } from 'react'
import { NFT_ADDRESS } from '../constants'

export function useTezos() {
  const RPC_URL = 'https://mainnet.smartpy.io/';
  // 'https://hangzhounet.smartpy.io'

  const Tezos = new TezosToolkit(RPC_URL)
  const wallet = new BeaconWallet({ name: "Orbitez" })
  const [balance, setBalance] = useState(0)
  Tezos.setWalletProvider(wallet)
  const [address, setAddress] = useState('')

  useEffect(() => {
    connectionExistsCheck()
    updateBalance()
  }, [address])

  const connectionExistsCheck = async () => {
    const activeAccount = await wallet.client.getActiveAccount()
    if (activeAccount) {
      console.log(`Already connected: ${activeAccount.address}` )
      setAddress(activeAccount.address)
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
      await wallet.requestPermissions({ network: {
        type: NetworkType.HANGZHOUNET,
        rpcUrl: RPC_URL,
      },})
      const addr = await wallet.getPKH()
      setAddress(addr)
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

