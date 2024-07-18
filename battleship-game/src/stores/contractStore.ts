import { ethers, formatUnits } from 'ethers';
import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import ContractAddress from '@/assets/contract/address.json';
import BattleshipGameJson from '@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json';
import getCellXY from '@/helpers/getCellXY';
import { MOVE_FEE } from '@/lib/constants';
import { useMessageStore } from '@/stores/messageStore';
import { useWalletStore } from '@/stores/walletStore';

import { useGameStore } from './gameStore';
import {handleMetaMaskError} from "@/lib/handleMetaMaskError";

export type ContractStore = {
    hits: string[][];
    misses: string[][];
    graveyard: boolean[];
    gameOver: boolean;
    prizePool: string;
    guessState: GuessState;
    lastGuessCoords: number[] | null;
    lastError: string;
    submitGuess: (x: number, y: number) => Promise<void>;
    resetGuessState: () => void;
    setPrizePool: (pp: string) => void;
    setHits: (h: string[][]) => void;
    setMisses: (m: string[][]) => void;
    setGraveyard: (g: boolean[]) => void;
    setLastGuessCoords: (g: string[]) => void;
};

export type GuessState =
    | 'IDLE'
    | 'STARTED'
    | 'ERROR'
    | 'TRANSACTION_SUCCESS'
    | 'RECEIVED_RECEIPT'
    | 'HIT'
    | 'MISS';

export const useContractStore = create<ContractStore>(
    persist(
        (set, get) => ({
            hits: [],
            misses: [],
            graveyard: [],
            gameOver: false,
            prizePool: '',
            guessState: 'IDLE' as GuessState,
            lastError: '',
            lastGuessCoords: null,

            submitGuess: async (x: number, y: number) => {
                const signer = useWalletStore.getState().signer;
                const addNewMessage = useMessageStore.getState().addNewMessage;

                if (!signer) {
                    throw new Error('No signer available.');
                    return;
                }

                set({ guessState: 'STARTED' });

                addNewMessage('Issuing Guess...');
                const contract = new ethers.Contract(
                    ContractAddress.address,
                    BattleshipGameJson.abi,
                    signer
                );
                const moveFee = ethers.parseEther(MOVE_FEE);
                try {
                    const submitTx = await contract.hit(x, y, {
                        value: moveFee,
                    });
                    set({ guessState: 'TRANSACTION_SUCCESS' });
                    const receipt = await submitTx.wait();
                    addNewMessage('Issued Guess tx: ' + receipt.hash);
                    const { allHits, allMisses, graveyard, prizePool, success, guessedCoords } =
                        receipt.logs[0].args.toObject();

                    get().setHits(allHits);
                    get().setMisses(allMisses);
                    get().setGraveyard(graveyard);
                    get().setPrizePool(prizePool);
                    set({ guessState: success ? 'HIT' : 'MISS' });
                    get().setLastGuessCoords(guessedCoords);
                } catch (error) {
                    const e = error as { reason?: string };
                    set({ guessState: 'ERROR' });
                    if (e?.reason) {
                        addNewMessage('Failed to issue Guess - ' + e?.reason + ' ...', 'ERROR');
                        set({ lastError: 'Failed to issue Guess - ' + e?.reason });

                        if (e?.reason === 'Cell already hit') {
                            useGameStore.getState().addUnknownCell(x, y);
                        }
                    } else {
                        addNewMessage(
                            handleMetaMaskError(error),
                            'ERROR'
                        );
                        set({ lastError: handleMetaMaskError(error) });
                        console.error(e);
                    }
                }
            },

            resetGuessState: () =>
                set({
                    guessState: 'IDLE',
                }),

            setGraveyard: (latestGraveyard: boolean[]) => {
                const addNewMessage = useMessageStore.getState().addNewMessage;

                const graveyardHasUpdated =
                    get().graveyard.length !== latestGraveyard.length ||
                    get().graveyard.some((value, index) => value !== latestGraveyard[index]);

                if (graveyardHasUpdated) {
                    set({ graveyard: latestGraveyard });
                    addNewMessage('Graveyard info updated.');
                }
            },

            setMisses: (latestMisses: string[][]) => {
                const currentMisses = useGameStore.getState().missedCells;
                const addNewMessage = useMessageStore.getState().addNewMessage;
                const missesHaveUpdated = latestMisses.length !== currentMisses.length;

                if (missesHaveUpdated) {
                    const missedCells = latestMisses.map((entry) => {
                        const [x, y] = getCellXY(parseInt(entry[0]), parseInt(entry[1]));
                        return {
                            col: parseInt(entry[0]),
                            row: parseInt(entry[1]),
                            x,
                            y,
                            state: 'MISSED',
                        };
                    });

                    set({ misses: latestMisses });
                    useGameStore.setState({ missedCells });
                    useGameStore.getState().setRevealedCells(latestMisses, 'MISS');
                    useGameStore.getState().clearUnknownCells();
                    addNewMessage('Missed. Shot failed to find target.');
                }
            },

            //TODO: Given the similarity of the methods here might be worth combining with the above.
            setHits: (latestHits: string[][]) => {
                const currentHits = useGameStore.getState().hitCells;
                const addNewMessage = useMessageStore.getState().addNewMessage;
                const hitsHaveUpdated = latestHits.length !== currentHits.length;

                if (hitsHaveUpdated) {
                    const hitCells = latestHits.map((entry) => {
                        const [x, y] = getCellXY(parseInt(entry[0]), parseInt(entry[1]));
                        return {
                            col: parseInt(entry[0]),
                            row: parseInt(entry[1]),
                            x,
                            y,
                            state: 'MISSED',
                        };
                    });

                    set({ hits: latestHits });
                    useGameStore.setState({ hitCells });
                    useGameStore.getState().setRevealedCells(latestHits, 'HIT');
                    addNewMessage('DIRECT HIT. Shot successfully found target.', 'SUCCESS');
                }
            },

            setPrizePool: (prizePool: string) => {
                const addNewMessage = useMessageStore.getState().addNewMessage;

                addNewMessage(
                    `[BattleshipGame Contract] Prize pool at: ${formatUnits(prizePool, 'ether')} ETH`
                );
                set({ prizePool: formatUnits(prizePool, 'ether') });
            },

            setLastGuessCoords: (coords: string[]) => {
                set({ lastGuessCoords: [parseInt(coords[0]), parseInt(coords[1])] });
            },
        }),
        {
            name: 'contract-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ prizePool: state.prizePool, graveyard: state.graveyard }),
        }
    ) as StateCreator<ContractStore, [], []>
);
