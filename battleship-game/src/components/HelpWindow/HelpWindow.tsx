import Button from '@/components/Button/Button';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useGameStore } from '@/stores/gameStore';

export default function HelpWindow() {
    const [toggleHelpWindow, helpWindowOpen] = useGameStore((state) => [
        state.toggleHelpWindow,
        state.helpWindowOpen,
    ]);

    if (!helpWindowOpen) return null;

    const handleClose = () => {
        toggleHelpWindow();
    };

    return (
        <HudWindow
            headerTitle="How to play"
            modalMode={true}
            speed={0.2}
            footerContent={
                <div className="flex justify-end">
                    <Button onClick={handleClose}>Close</Button>
                </div>
            }
        >
            <div className="max-w-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Battleships Game Rules</h1>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Grid Visibility</h2>
                    <ul className="list-disc list-inside">
                        <li>The game grid is hidden until you make a guess.</li>
                        <li>
                            After each guess, the grid will be updated to reflect the latest game
                            state.
                        </li>
                        <li>The board updates only after each guess is made.</li>
                    </ul>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Guessing and Placement</h2>
                    <ul className="list-disc list-inside">
                        <li>
                            If you try to guess a cell that has already been chosen by another
                            player, your guess will be invalid, and the transaction will be
                            cancelled.
                        </li>
                    </ul>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Prize Pool</h2>
                    <ul className="list-disc list-inside">
                        <li>Each time a player makes a guess, the prize pool increases.</li>
                        <li>
                            Once all ships have been sunk, the prize pool will be distributed among
                            the players.
                        </li>
                        <li>
                            The distribution of the prize pool will be based on the number of ships
                            each player has sunk.
                        </li>
                    </ul>
                </div>
            </div>
        </HudWindow>
    );
}
