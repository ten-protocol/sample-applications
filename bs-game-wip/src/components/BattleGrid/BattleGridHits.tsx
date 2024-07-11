import React, {useEffect, useMemo, useRef} from "react";
import BattleGridCell from "./BattleGridCell";
import {useBattleGridStore} from "../../stores/battleGridStore";
import {Container, useTick} from "@pixi/react";

import {GlowFilter} from "@pixi/filter-glow"
import {OutlineFilter} from "@pixi/filter-outline"
import {QUERY_INTERVAL_MS} from "../../lib/constants";
import {useWalletStore} from "../../stores/walletStore";
import {useContractStore} from "../../stores/contractStore";

export default function BattleGridHits () {
    const hitCells = useBattleGridStore((state) => state.hitCells);
    const isConnected = useWalletStore(state => state.isConnected)
    const getAllHits = useContractStore(state => state.getAllHits)
    const revealedGridCells = useMemo(
        () => (hitCells.map(({row, col, x, y}) => <BattleGridCell key={`${row}-${col}`} x={x} y={y} row={row} col={col} state="HIT" />)),
        [hitCells]
    );

    const containerRef = useRef(null);
    const glowFilterRef = useRef(new GlowFilter({ distance: 15, innerStrength:0, color: 0xE82E2E, alpha: .4 }));
    const outlineFilterRef = useRef(new OutlineFilter(1, 0xFFFFFF, 1, 1, false));
    const timeRef = useRef(0);


    useEffect(() => {
        let interval

        if (isConnected) {
            getAllHits()
            interval = setInterval(() => {
                getAllHits()
            }, QUERY_INTERVAL_MS)
        }

        return () => clearInterval(interval)
    }, [isConnected])

    // useTick((delta) => {
    //
    //     const glowFilter = glowFilterRef.current;
    //     const outlineFilter = outlineFilterRef.current;
    //     const speed = .04
    //     timeRef.current += delta;
    //     const pulse = Math.sin(timeRef.current * speed) * .75 + .75;
    //
    //     glowFilter.outerStrength = 1 + pulse; // Oscillate between 2 and 4
    //     outlineFilter.alpha = 1 + pulse
    //     // glowFilter.innerStrength = pulse/2; // Oscillate between 1 and 2
    //
    //     if (containerRef.current) {
    //         containerRef.current.filters = [outlineFilter];
    //     }
    // });

    return (
        <Container ref={containerRef}>
            {revealedGridCells}
        </Container>
    )
}