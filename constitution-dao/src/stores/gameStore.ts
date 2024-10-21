import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type GameState = {};
type GameActions = {};

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>(
  persist((set, get) => ({}), {
    name: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}-tenzen-storage`,
    storage: createJSONStorage(() => localStorage),
    partialize: ({}) => ({}),
  }) as StateCreator<GameStore, [], []>
);
