import { useShallow } from 'zustand/react/shallow';

import HudWindow from '@/components/HudWindow/HudWindow';
import { COLS, ROWS } from '@/lib/constants';
import { useGameStore } from '@/stores/gameStore';
import { useWalletStore } from '@/stores/walletStore';
import CellRemainingPieChart from "./CellRemainingPieChart";
import formatNumber from "@/helpers/formatNumber";

export default function CellsRemaining() {
    const [misses, hits] = useGameStore(useShallow((state) => [state.missedCells, state.hitCells]));
    const isConnected = useWalletStore((state) => state.isConnected);
    const numberOfRevealedCells = misses.length + hits.length;
    const totalCells = ROWS * COLS;
    const unknownState = misses.length + hits.length === 0;
    const Disconnected = <p className="text-center">System Offline</p>;

    const Footer = (
        <div className="text-right">
            <h3 className="text-2xl whitespace-nowrap">
                {unknownState ? '?????' : formatNumber(totalCells - numberOfRevealedCells)}/{formatNumber(totalCells)}
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
        >
            {unknownState ? <p className="text-center py-2">No Data</p> : <CellRemainingPieChart totalCells={totalCells} revealedCells={numberOfRevealedCells} />}
        </HudWindow>
    );
}
