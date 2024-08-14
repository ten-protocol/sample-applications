import { serializeError } from '@metamask/rpc-errors';

interface MetaMaskError extends Error {
    code?: number;
    data?: any;
}

interface SerializedError {
    data?: {
        message?: string;
        cause?: {
            info?: {
                error?: {
                    data?: {
                        message?: string;
                    };
                };
            };
        };
    };
}

export function handleMetaMaskError(error: unknown): string {
    if (!error) {
        return 'Unknown error';
    }

    if (typeof error !== 'object' || error === null) {
        return 'Invalid error format';
    }

    const metaMaskError = error as MetaMaskError;

    if (!metaMaskError.code) {
        return metaMaskError.message ?? JSON.stringify(error);
    }

    const serializedError = serializeError(metaMaskError) as SerializedError;

    const errorMessage =
        serializedError?.data?.cause?.info?.error?.data?.message ?? serializedError?.data?.message;

    if (errorMessage?.includes('no signed viewing keys')) {
        return `Missing viewing key. It looks like you may not have registered through the Ten gateway.`;
    }

    if (errorMessage?.includes('invalid viewing key signature for requested address')) {
        return `Invalid viewing key. Please ensure the connected account is also authenticated via the Ten gateway.`;
    }

    return errorMessage ? errorMessage.toString() : 'Unknown error message';
}
