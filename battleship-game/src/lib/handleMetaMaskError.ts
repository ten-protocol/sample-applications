import {serializeError} from '@metamask/rpc-errors'

export function handleMetaMaskError(error: any) {
    console.log(error)
    if (!error) {
        return 'Unknown error'
    }

    if (!error.code) {
        return error.message ?? error
    }

    const serializedError = serializeError(error)
    const errorMessage =
        serializedError?.data?.cause?.info?.error?.data?.message ?? serializedError?.data?.message

    if (errorMessage?.includes('no signed viewing keys')) {
        return `Missing viewing key. It looks like you may not have registered through the Ten gateway.`
    }

    if (errorMessage?.includes('invalid viewing key signature for requested address')) {
        return `Invalid viewing key. Please ensure the connected account is also authenticated via the Ten gateway.`
    }
    console.log(errorMessage)
    return errorMessage.toString()
}