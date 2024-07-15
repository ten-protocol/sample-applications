import { useEffect, useState } from 'react';

import detectEthereumProvider from '@metamask/detect-provider';

import BattleGrid from '@/components/BattleGrid/BattleGrid';
import CellsRemaining from '@/components/CellsRemaining/CellsRemaining';
import Graveyard from '@/components/Graveyard/Graveyard';
import HelpWindow from '@/components/HelpWindow/HelpWindow';
import MessageLog from '@/components/MessageLog/MessageLog';
import MetaMask from '@/components/MetaMask/MetaMask';
import PageHeader from '@/components/PageHeader/PageHeader';
import PrizePool from '@/components/PrizePool/PrizePool';
import ProcessingNotification from '@/components/ProcessingNotification/ProcessingNotification';
import { trackEvent } from '@/lib/trackEvent';
import { useMessageStore } from '@/stores/messageStore';
import { useWalletStore } from '@/stores/walletStore';

import './App.css';

function App() {
    const [setProvider, address, setAddress] = useWalletStore((state) => [
        state.setProvider,
        state.address,
        state.setAddress,
    ]);
    const addNewMessage = useMessageStore((state) => state.addNewMessage);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        connectToMetaMask();
    }, [address]);

    const connectToMetaMask = async () => {
        try {
            const provider = await detectEthereumProvider();
            //TODO: If we want to only support metamask there is a 'isMetaMask' property on the provider object
            if (provider) {
                setProvider(provider);
                const chainId = await provider.request({ method: 'eth_chainId' });
                if (chainId !== '0x1bb') {
                    addNewMessage(
                        'Not connected to Ten ! Connect at <a href="https://testnet.ten.xyz/" target="_blank" rel="noopener noreferrer">https://testnet.ten.xyz/</a> '
                    );
                    return;
                }

                const accounts = await provider.request({
                    method: 'eth_requestAccounts',
                });

                setAddress(accounts[0]);
                addNewMessage('Connected to wallet ! Account: ' + accounts[0]);
                setInitialized(true);

                trackEvent('connect_wallet', {
                    value: accounts[0],
                });
            } else {
                addNewMessage('Please install MetaMask!', 'ERROR');
                setInitialized(true);
            }
        } catch (err) {
            console.error('Error:', err.message);
            setInitialized(true);
        }
    };

    if (!initialized) {
        return null;
    }

    return (
        <>
            <PageHeader />
            <div className="grid grid-cols-[220px_1fr_220px] gap-6">
                <div>
                    <Graveyard />
                </div>
                <div className="overflow-hidden">
                    <BattleGrid />
                </div>
                <div className="flex flex-col gap-4">
                    <MetaMask />
                    <PrizePool />
                    <CellsRemaining />
                </div>
                <div className="col-span-3">
                    <MessageLog />
                </div>
            </div>
            <ProcessingNotification />
            <HelpWindow />
        </>
    );
}

export default App;
