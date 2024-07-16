import ShipFresh from '@/assets/shipFresh.svg';
import ShipSunk from '@/assets/shipSunk.svg';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useContractStore } from '@/stores/contractStore';
import { useWalletStore } from '@/stores/walletStore';
import {SHIP_SIZE} from "@/lib/constants";
import {useGameStore} from "@/stores/gameStore";

export default function Graveyard() {
    const graveyard = useContractStore(state => state.graveyard);
    const hitCells = useGameStore(state => state.hitCells)
    const isConnected = useWalletStore((state) => state.isConnected);
    const sunkShipTotal = graveyard.reduce((nxt, cur) => (cur ? nxt : nxt + 1), 0);
    const fleetHealth = 100 - ((hitCells.length / (graveyard.length * SHIP_SIZE)) * 100);
    const unknownState = graveyard.length === 0;

    const Footer = (
        <div className="text-right">
            <h3 className="text-sm whitespace-nowrap">Fleet Strength</h3>
            <p className="text-xl whitespace-nowrap">
                {unknownState ? '???' : fleetHealth.toFixed(1)}% PERC
            </p>
            {!unknownState && <div className="h-2 bg-zinc-400 mt-2">
                <div className="h-2 bg-zinc-950" style={{width: fleetHealth + "%"}}/>
            </div>}

            <p className="text-3xl mt-5 whitespace-nowrap font-bold">
                {unknownState ? '???' : sunkShipTotal}/{unknownState ? '???' : graveyard.length}
            </p>
            <h3 className="text-sm whitespace-nowrap">Ships remaining</h3>
        </div>
    );

    return (
        <HudWindow
            headerTitle="Enemy Fleet"
            isOpen={isConnected}
            footerContent={Footer}
            closedContent={<p className="text-center">System Offline</p>}
        >
            {unknownState ? (
                <h3 className="text-lg text-center my-3">No Data</h3>
            ) : (
                <div className="grid grid-cols-10 gap-1 my-2">
                    {graveyard.map((ship, i) => (
                        <img
                            key={i}
                            src={ship ? ShipSunk : ShipFresh}
                            alt="Logo"
                            width="20"
                            height="10"
                        />
                    ))}
                </div>
            )}
        </HudWindow>
    );
}
