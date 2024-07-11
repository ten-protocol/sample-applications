import React, {useEffect, useMemo} from "react";
import BattleGridCell from "./BattleGridCell";
import {useBattleGridStore} from "../../stores/battleGridStore";
import {Container} from "@pixi/react";
import {QUERY_INTERVAL_MS} from "../../lib/constants";
import {useContractStore} from "../../stores/contractStore";
import {useWalletStore} from "../../stores/walletStore";

export default function BattleGridMisses () {
    const missedCells = useBattleGridStore((state) => state.missedCells);
    const isConnected = useWalletStore(state => state.isConnected)
    const getAllMisses = useContractStore(state => state.getAllMisses)
    const revealedGridCells = useMemo(
        () => (missedCells.map(({row, col, x, y}) => <BattleGridCell key={`${row}-${col}`} x={x} y={y} row={row} col={col} state="MISSED" />)),
        [missedCells]
    );


    useEffect(() => {
        let interval

        if (isConnected) {
            getAllMisses()
            interval = setInterval(() => {
                getAllMisses()
            }, QUERY_INTERVAL_MS)
        }

        return () => clearInterval(interval)
    }, [isConnected])

    return (
        <Container>
            {revealedGridCells}
        </Container>
    )
}