import { useEffect, useState } from 'react';

import detectEthereumProvider from '@metamask/detect-provider';
import { Eip1193Provider } from 'ethers/src.ts/providers/provider-browser';

import BattleGrid from '@/components/BattleGrid/BattleGrid';
import CellsRemaining from '@/components/CellsRemaining/CellsRemaining';
import Graveyard from '@/components/Graveyard/Graveyard';
import HelpWindow from '@/components/HelpWindow/HelpWindow';
import MessageLog from '@/components/MessageLog/MessageLog';
import MetaMask from '@/components/MetaMask/MetaMask';
import PageHeader from '@/components/PageHeader/PageHeader';
import PrizePool from '@/components/PrizePool/PrizePool';
import ProcessingNotification from '@/components/ProcessingNotification/ProcessingNotification';
import { TEN_CHAIN_ID } from '@/lib/constants';
import { trackEvent } from '@/lib/trackEvent';
import { useMessageStore } from '@/stores/messageStore';
import { useWalletStore } from '@/stores/walletStore';

import './App.css';

function App() {
    const [address, setAddress, setProvider, handleNetworkChange] = useWalletStore((state) => [
        state.address,
        state.setAddress,
        state.setProvider,
        state.handleNetworkChange,
    ]);
    const addNewMessage = useMessageStore((state) => state.addNewMessage);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setInitialized(true), 2000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        connectToMetaMask();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [address]);

    const connectToMetaMask = async () => {
        try {
            const provider: Eip1193Provider | null = await detectEthereumProvider();
            //TODO: If we want to only support metamask there is a 'isMetaMask' property on the provider object
            if (provider) {
                const chainId = await provider.request({ method: 'eth_chainId' });
                if (chainId !== TEN_CHAIN_ID) {
                    addNewMessage('Not connected to Ten ! Connect at https://testnet.ten.xyz');
                }
                setProvider(provider, chainId);

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
        } catch (err: any) {
            console.error('Error:', err?.message);
            setInitialized(true);
        }
    };

    const handleAccountsChanged = (addresses: string[]) => {
        if (addresses.length === 0) {
            setAddress(null);
        } else {
            setAddress(addresses[0]);
        }
    };

    const handleChainChanged = (chainId: string) => {
        console.log('Network changed to:', chainId);
        handleNetworkChange(chainId);
    };

    if (!initialized) {
        return null;
    }

    return (
        <div className="p-2">
            <PageHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[220px_1fr_220px] gap-6">
                <div className="order-2 lg:order-1">
                    <Graveyard />
                </div>
                <div className="overflow-hidden order-1 md:col-span-2 lg:order-2 lg:col-span-1">
                    <BattleGrid />
                </div>
                <div className="flex flex-col gap-4 order-3 md:col-span-3 md:grid md:grid-cols-3 lg:col-span-1 lg:grid-cols-1">
                    <MetaMask />
                    <PrizePool />
                    <CellsRemaining />
                </div>
                <div className="md:col-span-3 order-4">
                    <MessageLog />
                </div>
            </div>
            <ProcessingNotification />
            <HelpWindow />
        </div>
    );
}

export default App;
