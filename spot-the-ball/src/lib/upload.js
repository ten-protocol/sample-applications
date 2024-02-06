const Moralis = require('moralis')
const fs = require('fs')

async function uploadToIPFS() {
  await Moralis.start({
    apiKey: import.meta.env.VITE_MORALIS_API_KEY
  })
}

uploadToIPFS()
