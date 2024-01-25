import { defineStore } from 'pinia'
/* import the ipfs-http-client library */
import { create as ipfsHttpClient } from 'ipfs-http-client'
/* Create an instance of the client */
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
/* upload the file */
// const added = await client.add(file)
// /* or a string */
// const added = await client.add('hello world')

export const useBattleStore = defineStore('battleStore', {
  state: () => ({}),

  getters: {},

  actions: {
    async uploadFile(file: any) {
      const added = await client.add(file)
      console.log(added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
    }
  }
})
