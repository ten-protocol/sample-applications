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

export default function CellHighlight({ duration }) {
    const [lastGuessCoords, guessState] = useContractStore((state) => [
        state.lastGuessCoords,
        state.guessState,
    ]);
    const selectedCell = useBattleGridStore((state) => state.selectedCell);
    const [particles, setParticles] = useState([]);
    const [isAnimating, setIsAnimating] = useState(true);
    const hide = guessState === 'IDLE';

    useEffect(() => {
        if (hide) return;
        let particles = [];

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

        const timeout = setTimeout(() => {
            setIsAnimating(false);
        }, duration);

        return () => clearTimeout(timeout);
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
