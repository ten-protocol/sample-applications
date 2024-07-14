import { useEffect, useState } from 'react';

import { Container } from '@pixi/react';

import { useBattleGridStore } from '@/stores/battleGridStore';
import { useContractStore } from '@/stores/contractStore';

import BattleGridExplosionParticle from './BattleGridExplosionParticle';

export default function BattleGridExplosion({ particleCount, duration }) {
    const guessState = useContractStore((state) => state.guessState);
    const selectedCell = useBattleGridStore((state) => state.selectedCell);
    const [particles, setParticles] = useState([]);
    const hide = guessState !== 'HIT';

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
