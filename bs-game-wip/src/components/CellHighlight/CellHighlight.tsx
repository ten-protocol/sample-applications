import { useEffect, useState } from 'react';

import { Container } from '@pixi/react';

import { useBattleGridStore } from '@/stores/battleGridStore';
import { useContractStore } from '@/stores/contractStore';

import CellHighlightParticle from './CellHighlightParticle';
import {
    DefaultHighlightState,
    ErrorHighlightState,
    HitHighlightState,
    MissHighlightState,
} from './CellHighlightStates';

export default function CellHighlight() {
    const guessState = useContractStore((state) => state.guessState);
    const selectedCell = useBattleGridStore((state) => state.selectedCell);
    const [particles, setParticles] = useState([]);
    const hide = guessState === 'IDLE';
    const duration = 1000;

    useEffect(() => {
        if (hide) return;

        if (guessState === 'STARTED') {
            setParticles(DefaultHighlightState(selectedCell.x, selectedCell.y, duration));
        }

        if (guessState === 'ERROR') {
            setParticles(ErrorHighlightState(selectedCell.x, selectedCell.y, duration));
        }

        if (guessState === 'MISS') {
            setParticles(MissHighlightState(selectedCell.x, selectedCell.y, duration));
        }

        if (guessState === 'HIT') {
            setParticles(HitHighlightState(selectedCell.x, selectedCell.y, duration));
        }
    }, [selectedCell, guessState, duration]);

    if (hide) return null;

    return (
        <Container>
            {particles.map((p, i) => (
                <CellHighlightParticle key={`${p.x}-${p.y}-${i}`} {...p} />
            ))}
        </Container>
    );
}
