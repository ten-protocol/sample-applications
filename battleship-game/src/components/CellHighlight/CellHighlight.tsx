import { useEffect, useState } from 'react';

import { Container } from '@pixi/react';

import { useContractStore } from '@/stores/contractStore';
import { useGameStore } from '@/stores/gameStore';

import CellHighlightParticle from './CellHighlightParticle';
import {
    DefaultHighlightState,
    ErrorHighlightState,
    HitHighlightState,
    MissHighlightState,
} from './CellHighlightStates';
import {Particle} from "./cellHighlights.models";

export default function CellHighlight() {
    const guessState = useContractStore((state) => state.guessState);
    const selectedCell = useGameStore((state) => state.selectedCell);
    const [particles, setParticles] = useState<Particle[]>([]);
    const hide = guessState === 'IDLE' || !selectedCell;
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
