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

    const Footer = (
        <div className="text-right">
            <h6 className="text-sm">Fleet Strength</h6>
            <h3 className="text-xl">{fleetHealth.toFixed(1)}% PERC</h3>
            <h3 className="text-3xl mt-4">
                {sunkShipTotal}/{graveyard.length}
            </h3>
            <h6 className="text-sm">Ships remaining</h6>
        </div>
    );

    return (
        <HudWindow
            headerTitle="Enemy Fleet"
            isOpen={isConnected}
            footerContent={Footer}
            closedContent={<p className="text-center">System Offline</p>}
        >
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
        </HudWindow>
    );
}
