import HudWindow from '@/components/HudWindow/HudWindow';
import { useContractStore } from '@/stores/contractStore';
import { useWalletStore } from '@/stores/walletStore';

export default function PrizePool() {
    const [prizePool] = useContractStore((state) => [state.prizePool]);
    const isConnected = useWalletStore((state) => state.isConnected);
    const unknownState = prizePool === '';

    return (
        <HudWindow
            headerTitle="Prize pool"
            isOpen={isConnected}
            closedContent={<p className="text-center">System Offline</p>}
        >
            <h3 className="text-3xl text-right my-2">
                {unknownState ? '???.????' : prizePool} <span className="text-xl">ETH</span>
            </h3>
        </HudWindow>
    );
}
