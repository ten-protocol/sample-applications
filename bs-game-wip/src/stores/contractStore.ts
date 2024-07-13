import { ethers, formatUnits } from 'ethers';
import { create } from 'zustand';

import ContractAddress from '@/assets/contract/address.json';
import BattleshipGameJson from '@/assets/contract/artifacts/contracts/BattleshipGame.sol/BattleshipGame.json';
import getCellXY from '@/helpers/getCellXY';
import { TOTAL_SHIPS } from '@/lib/constants';
import { MOVE_FEE } from '@/lib/constants';
import { useMessageStore } from '@/stores/messageStore';
import { useWalletStore } from '@/stores/walletStore';

import { useBattleGridStore } from './battleGridStore';

export interface IContractStore {
    hits: any[];
    misses: any[];
    graveyard: any[];
    gameOver: boolean;
    prizePool: string;
    guessState: GuessState;
    lastGuessCoords: number[] | null;
    lastError: string;
    submitGuess: (x: number, y: number) => Promise<void>;
    resetGuessState: () => void;
    setPrizePool: (pp: string) => void;
    setHits: (h: any[]) => void;
    setMisses: (m: any[]) => void;
    setGraveyard: (g: any[]) => void;
    setLastGuessCoords: (g: any) => void;
}

export type GuessState =
    | 'IDLE'
    | 'STARTED'
    | 'ERROR'
    | 'TRANSACTION_SUCCESS'
    | 'RECEIVED_RECEIPT'
    | 'HIT'
    | 'MISS';

export const useContractStore = create<IContractStore>((set, get) => ({
    hits: [],
    misses: [],
    graveyard: new Array(TOTAL_SHIPS).fill(false),
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
            console.log(submitTx);
            set({ guessState: 'TRANSACTION_SUCCESS' });
            const receipt = await submitTx.wait();
            addNewMessage('Issued Guess tx: ' + receipt.hash);
            const { allHits, allMisses, graveyard, prizePool, success, guessedCoords } =
                receipt.logs[0].args.toObject();
            console.log(receipt, receipt.logs[0].args.toObject());

            get().setHits(allHits);
            get().setMisses(allMisses);
            get().setGraveyard(graveyard);
            get().setPrizePool(prizePool);
            set({ guessState: success ? 'HIT' : 'MISS' });
            get().setLastGuessCoords(guessedCoords);
        } catch (e) {
            set({ guessState: 'ERROR' });
            if (e.reason) {
                addNewMessage('Failed to issue Guess - ' + e.reason + ' ...', 'ERROR');
                set({ lastError: 'Failed to issue Guess - ' + e.reason });
            } else {
                addNewMessage(
                    'Failed to issue Guess - unexpected error occurred, check the console logs...',
                    'ERROR'
                );
                set({ lastError: 'Failed to issue Guess - unexpected error occurred' });
                throw new Error(e);
            }
        }
    },

    resetGuessState: () =>
        set({
            guessState: 'IDLE',
        }),

    setGraveyard: (latestGraveyard: any[]) => {
        const addNewMessage = useMessageStore.getState().addNewMessage;

        const graveyardHasUpdated = get().graveyard.some(
            (value, index) => value !== latestGraveyard[index]
        );

        if (graveyardHasUpdated) {
            set({ graveyard: latestGraveyard });
            addNewMessage('Graveyard info updated.');
        }
    },

    setMisses: (latestMisses: any[]) => {
        const currentMisses = useBattleGridStore.getState().missedCells;
        const addNewMessage = useMessageStore.getState().addNewMessage;
        const missesHaveUpdated = latestMisses.length !== currentMisses.length;

        if (missesHaveUpdated) {
            const a = latestMisses.map((entry) => {
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
            useBattleGridStore.setState({ missedCells: a });
            addNewMessage('Missed. Shot failed to find target.');
        }
    },

    //TODO: Given the similarity of the methods here might be worth combining with the above.
    setHits: (latestHits: any[]) => {
        const currentHits = useBattleGridStore.getState().hitCells;
        const addNewMessage = useMessageStore.getState().addNewMessage;
        const hitsHaveUpdated = latestHits.length !== currentHits.length;

        if (hitsHaveUpdated) {
            const a = latestHits.map((entry) => {
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
            useBattleGridStore.setState({ hitCells: a });
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

    setLastGuessCoords: (coords: any) => {
        set({ lastGuessCoords: [parseInt(coords[0]), parseInt(coords[1])] });
    },
}));
