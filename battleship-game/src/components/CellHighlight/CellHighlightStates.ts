import { Particle } from './cellHighlights.models';

export function DefaultHighlightState(x: number, y: number, duration: number): Particle[] {
    const newParticles = [];
    const particleCount = 24;
    const angleIncrement = (Math.PI * 2) / particleCount; // Evenly distributed angles
    for (let i = 0; i < particleCount; i++) {
        const angle = angleIncrement * i;
        const rotationSpeed = 0.02; // Random rotation speed
        const startRadius = 400;
        const endRadius = i % 4 === 0 ? 48 : 32;
        const startHeight = 100;
        const endHeight = i % 4 === 0 ? 30 : 10;
        newParticles.push({
            x,
            y,
            angle,
            rotationSpeed,
            startRadius,
            endRadius,
            startHeight,
            endHeight,
            duration,
            color: 0xffffff,
        });
    }

    return newParticles;
}

export function ErrorHighlightState(x: number, y: number, duration: number): Particle[] {
    const newParticles = [];
    const particleCount = 24;
    const angleIncrement = (Math.PI * 2) / particleCount; // Evenly distributed angles
    for (let i = 0; i < particleCount; i++) {
        const angle = angleIncrement * i;
        const rotationSpeed = 0.02; // Random rotation speed
        const startRadius = 400;
        const endRadius = 32;
        const startHeight = 100;
        const endHeight = 2;
        newParticles.push({
            x,
            y,
            angle,
            rotationSpeed,
            startRadius,
            endRadius,
            startHeight,
            endHeight,
            duration,
            color: 0xdc2626,
        });
    }

    return newParticles;
}

export function MissHighlightState(x: number, y: number, duration: number): Particle[] {
    const newParticles = [];
    const particleCount = 24;
    const angleIncrement = (Math.PI * 2) / particleCount; // Evenly distributed angles
    for (let i = 0; i < particleCount; i++) {
        const angle = angleIncrement * i;
        const rotationSpeed = 0; // Random rotation speed
        const startRadius = 400;
        const endRadius = -1200;
        const startHeight = 100;
        const endHeight = 10;
        newParticles.push({
            x,
            y,
            angle,
            rotationSpeed,
            startRadius,
            endRadius,
            startHeight,
            endHeight,
            duration,
            color: 0xffffff,
            age: 60,
            ageReset: true,
        });
    }

    return newParticles;
}

export function HitHighlightState(x: number, y: number, duration: number): Particle[] {
    const newParticles = [];
    const particleCount = 24;
    const angleIncrement = (Math.PI * 2) / particleCount; // Evenly distributed angles
    for (let i = 0; i < particleCount; i++) {
        const angle = angleIncrement * i;
        const rotationSpeed = 0; // Random rotation speed
        const startRadius = 400;
        const endRadius = -1200;
        const startHeight = 30;
        const endHeight = 100;
        newParticles.push({
            x,
            y,
            angle,
            rotationSpeed,
            startRadius,
            endRadius,
            startHeight,
            endHeight,
            duration,
            color: 0xffffff,
            age: 50,
            ageReset: true,
        });
    }

    return newParticles;
}
