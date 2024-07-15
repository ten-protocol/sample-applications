import { useEffect, useState } from 'react';

import { Container } from '@pixi/react';

import { useContractStore } from '@/stores/contractStore';
import { useGameStore } from '@/stores/gameStore';

import BattleGridExplosionParticle, {ExplosionParticle} from './BattleGridExplosionParticle';

type Props = {
    particleCount: number,
    duration: number
}

export default function BattleGridExplosion({ particleCount, duration }: Props) {
    const guessState = useContractStore((state) => state.guessState);
    const selectedCell = useGameStore((state) => state.selectedCell);
    const [particles, setParticles] = useState<ExplosionParticle[]>([]);
    const hide = guessState !== 'HIT' || !selectedCell;

    useEffect(() => {
        if (hide) return;

        const newParticles = [];
        const { x, y } = selectedCell;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const rotationSpeed = (Math.random() - 0.5) * 0.1; // Random rotation speed
            newParticles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotationSpeed,
                duration,
                angle,
            });
        }
        setParticles(newParticles);
    }, [guessState, selectedCell, particleCount, duration]);

    if (hide) return null;

    return (
        <Container>
            {particles.map((p, i) => (
                <BattleGridExplosionParticle key={`${p.x}-${p.x}-${i}`} {...p} />
            ))}
        </Container>
    );
}
