export {};

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        ethereum?: {
            isMetaMask?: boolean;
            request?: (args: { method: string, params?: any[] }) => Promise<any>;
        }
    }
}