import { useShallow } from 'zustand/react/shallow';

import metaMaskLogo from '@/assets/metamask-logo.svg';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useMessageStore } from '@/stores/messageStore';
import { useWalletStore } from '@/stores/walletStore';

export default function MetaMask() {
    const { address, setAddress, tenNetwork } = useWalletStore(
        useShallow((state) => ({
            address: state.address,
            setAddress: state.setAddress,
            tenNetwork: state.tenNetwork,
        }))
    );
    const addNewMessage = useMessageStore((state) => state.addNewMessage);

    const connectAccount = async () => {
        if (window.ethereum?.request) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                setAddress(accounts[0]);
            } catch (error) {
                addNewMessage('User rejected the request.', 'ERROR');
            }
        }
    };

    return (
        <HudWindow
            headerTitle="Connection Status"
            footerContent={
                <div className="flex gap-4">
                    <img src={metaMaskLogo} width={50} />
                    {address ? (
                        <p>MetaMask Connected</p>
                    ) : (
                        <button onClick={connectAccount}>Connect to MetaMask</button>
                    )}
                </div>
            }
        >
            {!tenNetwork && (
                <div className="flex justify-center p-8">
                    <div className="border-l-stone-50 border p-4 -mb-6">
                        <p>Wallet connected but not to Ten.</p>
                        <p>
                            Connect at{' '}
                            <a href="HTTPS://TESTNET.TEN.XYZ" rel="noopener" target="_blank">
                                HTTPS://TESTNET.TEN.XYZ
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </HudWindow>
    );
}
