export {};

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        ethereum?: {
            isMetaMask?: boolean;
            request?: (args: { method: string, params?: any[] }) => Promise<any>;
            on: (...args: any[]) => void;
            removeListener: (...args: any[]) => void;
        }
    }
}