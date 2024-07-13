import ShipFresh from '@/assets/shipFresh.svg';
import ShipSunk from '@/assets/shipSunk.svg';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useContractStore } from '@/stores/contractStore';
import { useWalletStore } from '@/stores/walletStore';

export default function Graveyard() {
    const [graveyard] = useContractStore((state) => [state.graveyard]);
    const isConnected = useWalletStore((state) => state.isConnected);
    const sunkShipTotal = graveyard.reduce((nxt, cur) => (cur ? nxt : nxt + 1), 0);
    const fleetHealth = (sunkShipTotal / graveyard.length) * 100;
    const unknownState = graveyard.length === 0;


    const Footer = (
        <div className="text-right">
            <h3 className="text-sm whitespace-nowrap">Fleet Strength</h3>
            <p className="text-xl whitespace-nowrap">{unknownState ? '???' : fleetHealth.toFixed(1)}% PERC</p>
            <p className="text-3xl mt-4 whitespace-nowrap">
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
