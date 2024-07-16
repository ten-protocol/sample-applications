import metaMaskLogo from '@/assets/metamask-logo.svg';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useMessageStore } from '@/stores/messageStore';
import { useWalletStore } from '@/stores/walletStore';

export default function MetaMask() {
    const [ address, setAddress] = useWalletStore((state) => [
        state.address,
        state.setAddress,
    ]);
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
        ></HudWindow>
    );
}
