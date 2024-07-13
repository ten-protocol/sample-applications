import HudWindow from '@/components/HudWindow/HudWindow';
import { COLS, ROWS } from '@/lib/constants';
import { useContractStore } from '@/stores/contractStore';
import { useWalletStore } from '@/stores/walletStore';

export default function CellsRemaining() {
    const [misses, hits] = useContractStore((state) => [state.misses, state.hits]);
    const isConnected = useWalletStore((state) => state.isConnected);
    const numberOfRevealedCells = misses.length + hits.length;
    const totalCells = ROWS * COLS;
    const unknownState = (misses.length + hits.length) === 0
    const Disconnected = <p className="text-center">System Offline</p>;

    const Footer = (
        <div className="text-right">
            <h3 className="text-2xl whitespace-nowrap">
                {unknownState ? "?????" : totalCells - numberOfRevealedCells}/{totalCells}
            </h3>
            <p className="text-sm whitespace-nowrap">Cells remaining</p>
        </div>
    );

    return (
        <HudWindow
            headerTitle={'Cells'}
            footerContent={Footer}
            isOpen={isConnected}
            closedContent={Disconnected}
        />
    );
}
