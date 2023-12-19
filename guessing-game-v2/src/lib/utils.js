import { serializeError } from '@metamask/rpc-errors'

export function trackEvent(eventName, eventData) {
  if (!window.gtag) {
    return
  }
  window.gtag('event', eventName, eventData)
}

export function handleMetaMaskError(error) {
  if (!error.code) {
    return error.message
  }

  const serializedError = serializeError(error)
  const errorMessage =
    serializedError?.data?.cause?.error?.data?.message ?? serializedError?.data?.message

  if (errorMessage?.includes('no signed viewing keys')) {
    return `Missing viewing key. It looks like you may not have registered through the <a href="https://testnet.obscu.ro/" class="connect-link" target="_blank" rel="noopener noreferrer">gateway</a>`
  }

  if (errorMessage?.includes('invalid viewing key')) {
    return `Invalid viewing key. Please ensure are connected to the gateway <a href="https://testnet.obscu.ro/" class="connect-link" target="_blank" rel="noopener noreferrer">here</a>`
  }

  return errorMessage
}
